import React, { useState, useEffect, useCallback } from 'react';
import { Product, StockHistoryItem, UserSession, ViewTab, ToastMessage } from './types';
import { INITIAL_PRODUCTS, INITIAL_HISTORY } from './data/seedData';
import { Header } from './components/Header';
import { AurumWarehouse } from './components/AurumWarehouse';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { StockHistoryView } from './components/StockHistoryView';
import { LoginPage } from './components/LoginPage';
import { ProductModal } from './components/ProductModal';
import { DeleteModal } from './components/DeleteModal';
import { ToastContainer } from './components/Toast';

export default function App() {
  // Current tab view: defaults to 'aurum' to display the attached Aurum Warehouse live 3D site
  const [currentTab, setCurrentTab] = useState<ViewTab>('aurum');

  // Backend URL
  const [backendUrl] = useState<string>('http://localhost:8080');

  // User session
  const [user, setUser] = useState<UserSession>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return {
        username: savedUser,
        isLoggedIn: true,
      };
    }
    return {
      username: 'Abhi',
      isLoggedIn: true,
    };
  });

  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('inventory_products');
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Stock history state
  const [history, setHistory] = useState<StockHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('inventory_history');
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return INITIAL_HISTORY;
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  // Show Toast helper
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync products and history to localStorage
  useEffect(() => {
    localStorage.setItem('inventory_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('inventory_history', JSON.stringify(history));
  }, [history]);

  // Handle Save (Add or Edit)
  const handleSaveProduct = async (productData: {
    name: string;
    category: string;
    price: number;
    quantity: number;
    lowStockThreshold: number;
  }) => {
    const status = productData.quantity <= productData.lowStockThreshold ? 'LOW_STOCK' : 'AVAILABLE';

    if (productToEdit) {
      // Edit mode
      const oldQty = productToEdit.quantity;
      const updatedProduct: Product = {
        ...productToEdit,
        ...productData,
        status,
        updatedAt: new Date().toISOString(),
      };

      setProducts(prev => prev.map(p => (p.id === productToEdit.id ? updatedProduct : p)));

      // Add to stock history
      const newHistoryItem: StockHistoryItem = {
        id: Date.now(),
        productId: productToEdit.id,
        productName: productData.name,
        changeType: 'UPDATED',
        oldQuantity: oldQty,
        newQuantity: productData.quantity,
        changedBy: user.username,
        changedAt: new Date().toLocaleDateString('en-IN') + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase(),
      };
      setHistory(prev => [newHistoryItem, ...prev]);

      fetch(`${backendUrl}/products/${productToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Username': user.username,
        },
        body: JSON.stringify(updatedProduct),
      }).catch(() => null);

      showToast(`Product "${productData.name}" updated successfully!`, 'success');
    } else {
      // Add mode
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const newProduct: Product = {
        id: newId,
        ...productData,
        status,
        createdAt: new Date().toLocaleDateString('en-IN'),
      };

      setProducts(prev => [newProduct, ...prev]);

      // Add to stock history
      const newHistoryItem: StockHistoryItem = {
        id: Date.now(),
        productId: newId,
        productName: productData.name,
        changeType: 'ADDED',
        oldQuantity: null,
        newQuantity: productData.quantity,
        changedBy: user.username,
        changedAt: new Date().toLocaleDateString('en-IN') + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase(),
      };
      setHistory(prev => [newHistoryItem, ...prev]);

      fetch(`${backendUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Username': user.username,
        },
        body: JSON.stringify(newProduct),
      }).catch(() => null);

      showToast(`Product "${productData.name}" added to inventory!`, 'success');
    }

    setIsProductModalOpen(false);
    setProductToEdit(null);
  };

  // Handle Delete
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    const targetProduct = products.find(p => p.id === deleteTarget.id);
    const oldQty = targetProduct ? targetProduct.quantity : null;

    setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));

    // Audit log
    const newHistoryItem: StockHistoryItem = {
      id: Date.now(),
      productId: deleteTarget.id,
      productName: deleteTarget.name,
      changeType: 'DELETED',
      oldQuantity: oldQty,
      newQuantity: null,
      changedBy: user.username,
      changedAt: new Date().toLocaleDateString('en-IN') + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase(),
    };
    setHistory(prev => [newHistoryItem, ...prev]);

    fetch(`${backendUrl}/products/${deleteTarget.id}`, {
      method: 'DELETE',
      headers: {
        'X-Username': user.username,
      },
    }).catch(() => null);

    showToast(`Deleted "${deleteTarget.name}" from inventory`, 'success');
    setDeleteTarget(null);
  };

  // Quick Restock from Dashboard or Table
  const handleQuickQuantityChange = (id: number, delta: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newQty = Math.max(0, p.quantity + delta);
          const newStatus = newQty <= p.lowStockThreshold ? 'LOW_STOCK' : 'AVAILABLE';

          const audit: StockHistoryItem = {
            id: Date.now(),
            productId: p.id,
            productName: p.name,
            changeType: 'UPDATED',
            oldQuantity: p.quantity,
            newQuantity: newQty,
            changedBy: user.username,
            changedAt: new Date().toLocaleDateString('en-IN') + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase(),
          };
          setHistory(h => [audit, ...h]);

          return {
            ...p,
            quantity: newQty,
            status: newStatus,
          };
        }
        return p;
      })
    );

    showToast(`Stock updated (${delta > 0 ? `+${delta}` : delta} units)`, 'info');
  };

  // Export CSV
  const handleExportCSV = () => {
    if (products.length === 0) {
      showToast('No products available to export', 'error');
      return;
    }

    let csvContent = 'Name,Category,Price,Quantity,Low Stock At,Status\n';
    products.forEach(p => {
      csvContent += `"${p.name.replace(/"/g, '""')}","${p.category}",${p.price},${p.quantity},${p.lowStockThreshold},${p.status}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inventory_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Inventory CSV file exported!', 'success');
  };

  // Authentication handlers
  const handleLoginSuccess = (username: string) => {
    localStorage.setItem('user', username);
    setUser({ username, isLoggedIn: true });
    setCurrentTab('aurum');
    showToast(`Welcome back, ${username}!`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser({ username: '', isLoggedIn: false });
    showToast('Signed out of workspace', 'info');
  };

  // If user is not logged in, show the authentic Login Page
  if (!user.isLoggedIn) {
    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <LoginPage onLogin={handleLoginSuccess} backendUrl={backendUrl} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f3efe4] flex flex-col font-['Times_New_Roman',Times,serif] relative selection:bg-[#d4af37]/30 selection:text-white">
      
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Header with Aurum Logistics branding and clean navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Content View */}
      {currentTab === 'aurum' && (
        <AurumWarehouse onOpenProductsTable={() => setCurrentTab('products')} />
      )}

      {currentTab !== 'aurum' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {currentTab === 'dashboard' && (
            <DashboardView
              products={products}
              onOpenAddModal={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
              onOpenEditModal={(id) => {
                const p = products.find(item => item.id === id);
                if (p) {
                  setProductToEdit(p);
                  setIsProductModalOpen(true);
                }
              }}
              onNavigateToProducts={() => setCurrentTab('products')}
              onQuickRestock={(id, amount) => handleQuickQuantityChange(id, amount)}
              username={user.username}
            />
          )}

          {currentTab === 'products' && (
            <ProductsView
              products={products}
              onOpenAddModal={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
              onOpenEditModal={(id) => {
                const p = products.find(item => item.id === id);
                if (p) {
                  setProductToEdit(p);
                  setIsProductModalOpen(true);
                }
              }}
              onOpenDeleteModal={(id, name) => setDeleteTarget({ id, name })}
              onQuickQuantityChange={handleQuickQuantityChange}
              onExportCSV={handleExportCSV}
            />
          )}

          {currentTab === 'history' && (
            <StockHistoryView
              history={history}
              onClearHistory={() => {
                setHistory([]);
                showToast('Stock audit history cleared', 'info');
              }}
            />
          )}

        </main>
      )}

      {/* Add / Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        productName={deleteTarget?.name || ''}
      />

    </div>
  );
}
