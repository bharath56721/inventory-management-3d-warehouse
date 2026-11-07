import React from 'react';
import { Product } from '../types';

interface DashboardViewProps {
  products: Product[];
  onOpenAddModal: () => void;
  onOpenEditModal: (id: number) => void;
  onNavigateToProducts: () => void;
  onQuickRestock: (id: number, amount: number) => void;
  username: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  onOpenAddModal,
  onNavigateToProducts,
  onQuickRestock,
  username,
}) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.status === 'LOW_STOCK');
  const availableProducts = products.filter(p => p.status === 'AVAILABLE');
  const totalStockValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);

  // Exact category ordering matching Figure 4.2
  const categoryOrder = ['Stationery', 'Electronics', 'Clothing', 'Tools', 'Furniture'];
  const categoryCounts: Record<string, number> = {
    Stationery: 0,
    Electronics: 0,
    Clothing: 0,
    Tools: 0,
    Furniture: 0,
  };

  products.forEach(p => {
    if (categoryCounts[p.category] !== undefined) {
      categoryCounts[p.category] += 1;
    } else {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }
  });

  const categoryBarColors: Record<string, string> = {
    Stationery: '#007bff', // Blue
    Electronics: '#28a745', // Green
    Clothing: '#fd7e14',   // Orange
    Tools: '#6f42c1',      // Purple
    Furniture: '#dc3545',  // Red
  };

  const maxCatCount = Math.max(...Object.values(categoryCounts), 1);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pt-2 pb-12 font-body">
      
      {/* Title Header matching Figure 4.2 */}
      <div>
        <h1 className="font-head text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-[#8b92ab] mt-1.5 font-normal">
          Welcome back, <strong className="text-white font-semibold">{username || 'Abhi'}</strong> — here&apos;s your inventory at a glance
        </p>
      </div>

      {/* 4 Stat Cards matching Figure 4.2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Products */}
        <div 
          onClick={onNavigateToProducts}
          className="bg-[#13161e] border border-[#2a2f3f] hover:border-[#343a50] rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5 cursor-pointer shadow-lg"
        >
          <div className="w-13 h-13 rounded-xl bg-[#5c6ef8]/15 border border-[#5c6ef8]/25 flex items-center justify-center text-xl flex-shrink-0">
            📦
          </div>
          <div>
            <div className="font-head text-3xl font-extrabold text-white tracking-tight leading-none">
              {totalProducts}
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#8b92ab] font-bold mt-1.5">
              Total Products
            </div>
          </div>
        </div>

        {/* Low Stock Items */}
        <div 
          onClick={onNavigateToProducts}
          className="bg-[#13161e] border border-[#2a2f3f] hover:border-[#f25c6e]/40 rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5 cursor-pointer shadow-lg"
        >
          <div className="w-13 h-13 rounded-xl bg-[#f25c6e]/15 border border-[#f25c6e]/25 flex items-center justify-center text-xl flex-shrink-0">
            ⚠️
          </div>
          <div>
            <div className="font-head text-3xl font-extrabold text-[#f25c6e] tracking-tight leading-none">
              {lowStockProducts.length}
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#8b92ab] font-bold mt-1.5">
              Low Stock Items
            </div>
          </div>
        </div>

        {/* Available Items */}
        <div 
          onClick={onNavigateToProducts}
          className="bg-[#13161e] border border-[#2a2f3f] hover:border-[#22d3a3]/40 rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5 cursor-pointer shadow-lg"
        >
          <div className="w-13 h-13 rounded-xl bg-[#22d3a3]/15 border border-[#22d3a3]/25 flex items-center justify-center text-xl flex-shrink-0">
            ✅
          </div>
          <div>
            <div className="font-head text-3xl font-extrabold text-[#22d3a3] tracking-tight leading-none">
              {availableProducts.length}
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#8b92ab] font-bold mt-1.5">
              Available Items
            </div>
          </div>
        </div>

        {/* Total Stock Value */}
        <div className="bg-[#13161e] border border-[#2a2f3f] hover:border-[#343a50] rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5 shadow-lg">
          <div className="w-13 h-13 rounded-xl bg-[#a78bfa]/15 border border-[#a78bfa]/25 flex items-center justify-center text-xl flex-shrink-0">
            💰
          </div>
          <div>
            <div className="font-head text-2xl lg:text-[26px] font-extrabold text-white tracking-tight leading-none truncate">
              ₹{totalStockValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#8b92ab] font-bold mt-1.5">
              Total Stock Value
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Category Breakdown & Low Stock Alerts matching Figure 4.2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* Category Breakdown Card */}
        <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl p-6 shadow-xl">
          <h3 className="font-head text-xs font-bold uppercase tracking-wider text-[#8b92ab] mb-6 flex items-center gap-2.5">
            <span className="w-[3px] h-3.5 bg-[#5c6ef8] rounded-full inline-block shadow-[0_0_8px_#5c6ef8]" />
            Category Breakdown
          </h3>

          <div className="space-y-4">
            {categoryOrder.map(cat => {
              const count = categoryCounts[cat] || 0;
              const barColor = categoryBarColors[cat] || '#007bff';
              const pct = Math.round((count / maxCatCount) * 100);

              return (
                <div key={cat} className="flex items-center gap-3 text-xs">
                  <span className="w-24 text-[#8b92ab] font-medium truncate">
                    {cat}
                  </span>
                  <div className="flex-1 bg-[#1a1e28] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono font-bold text-white text-xs">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-[#1a1e28] flex items-center justify-between text-xs text-[#8b92ab]">
            <span>Catalog Distribution</span>
            <button
              onClick={onNavigateToProducts}
              className="text-[#7b8aff] hover:underline font-semibold cursor-pointer"
            >
              View In Products Table →
            </button>
          </div>
        </div>

        {/* Low Stock Alerts Card */}
        <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-head text-xs font-bold uppercase tracking-wider text-[#8b92ab] flex items-center gap-2.5">
              <span className="w-[3px] h-3.5 bg-[#5c6ef8] rounded-full inline-block shadow-[0_0_8px_#5c6ef8]" />
              Low Stock Alerts
            </h3>
            <span className="text-xs font-mono text-[#f25c6e] font-bold">
              {lowStockProducts.length} Critical
            </span>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-[#8b92ab] py-8 text-center">
                ✅ No low stock alerts! All items are within safe levels.
              </p>
            ) : (
              lowStockProducts.map(item => (
                <div
                  key={item.id}
                  className="px-4 py-3 rounded-xl bg-[#f25c6e]/10 border border-[#f25c6e]/20 flex items-center justify-between transition-colors hover:border-[#f25c6e]/40"
                >
                  <span className="text-sm font-semibold text-white">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#f25c6e] text-white text-xs font-mono font-bold shadow-[0_0_8px_rgba(242,92,110,0.4)]">
                      {item.quantity} left
                    </span>
                    <button
                      onClick={() => onQuickRestock(item.id, 10)}
                      title="Quick Restock +10"
                      className="px-2 py-0.5 rounded bg-[#1a1e28] text-xs font-mono text-[#22d3a3] border border-[#2a2f3f] hover:bg-[#222736] cursor-pointer"
                    >
                      +10
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-[#1a1e28] flex items-center justify-between text-xs text-[#8b92ab]">
            <span>Threshold detection automatically flags items</span>
            <button
              onClick={onOpenAddModal}
              className="text-[#7b8aff] hover:underline font-semibold cursor-pointer"
            >
              + Add New Item
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
