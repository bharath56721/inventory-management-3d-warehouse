import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { 
  Search, 
  Download, 
  Plus, 
  Minus,
  Plus as PlusIcon
} from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  onOpenAddModal: () => void;
  onOpenEditModal: (id: number) => void;
  onOpenDeleteModal: (id: number, name: string) => void;
  onQuickQuantityChange: (id: number, delta: number) => void;
  onExportCSV: () => void;
}

const PAGE_SIZE = 8;

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onQuickQuantityChange,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Categories list
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category))).sort();
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      const matchesStatus = !selectedStatus || p.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'qty_asc') {
      result.sort((a, b) => a.quantity - b.quantity);
    }

    return result;
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-6xl mx-auto font-body pb-12">
      
      {/* Title Bar matching Figure 4.3 */}
      <div className="flex items-center justify-between pt-2 pb-2">
        <h1 className="font-head text-3xl font-extrabold text-white tracking-tight">
          Products
        </h1>
        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 rounded-xl bg-[#5c6ef8] hover:bg-[#7b8aff] text-white text-xs font-bold shadow-[0_0_15px_rgba(92,110,248,0.35)] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar matching Figure 4.3 */}
      <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl p-3.5 flex flex-wrap items-center gap-2.5 justify-between shadow-lg">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8b92ab]">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name…"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] focus:border-[#5c6ef8] text-white placeholder-[#555d76] text-xs font-medium outline-none transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] focus:border-[#5c6ef8] text-xs font-medium text-[#8b92ab] hover:text-white outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] focus:border-[#5c6ef8] text-xs font-medium text-[#8b92ab] hover:text-white outline-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="LOW_STOCK">Low Stock</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] focus:border-[#5c6ef8] text-xs font-medium text-[#8b92ab] hover:text-white outline-none cursor-pointer"
          >
            <option value="">Default Sort</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="name_asc">Name A–Z</option>
            <option value="qty_asc">Qty ↑</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={onExportCSV}
            className="px-3 py-2 rounded-xl bg-[#1a1e28] hover:bg-[#222736] border border-[#2a2f3f] text-[#8b92ab] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>⬇</span>
            <span>Export CSV</span>
          </button>

        </div>
      </div>

      {/* Table matching Figure 4.3 */}
      <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a1e28] border-b border-[#2a2f3f] text-[#555d76] font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-bold">#</th>
                <th className="py-3 px-4 font-bold">NAME</th>
                <th className="py-3 px-4 font-bold">CATEGORY</th>
                <th className="py-3 px-4 font-bold">PRICE</th>
                <th className="py-3 px-4 font-bold text-center">QTY</th>
                <th className="py-3 px-4 font-bold text-center">LOW STOCK AT</th>
                <th className="py-3 px-4 font-bold text-center">STATUS</th>
                <th className="py-3 px-4 font-bold">ADDED</th>
                <th className="py-3 px-4 font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2f3f]/50">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p, idx) => {
                  const isLow = p.status === 'LOW_STOCK';

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isLow
                          ? 'bg-[#f25c6e]/[0.05] hover:bg-[#f25c6e]/[0.09]'
                          : 'hover:bg-[#1a1e28]/60'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-[#555d76]">
                        {startIndex + idx + 1}
                      </td>

                      <td className="py-3 px-4 font-bold text-white">
                        {p.name}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#5c6ef8]/15 text-[#7b8aff] border border-[#5c6ef8]/25 font-mono text-[11px] font-semibold">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-medium text-white">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-white">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onQuickQuantityChange(p.id, -1)}
                            disabled={p.quantity <= 0}
                            title="Decrease 1"
                            className="w-4 h-4 rounded flex items-center justify-center text-[#8b92ab] hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className={isLow ? 'text-[#f25c6e]' : 'text-white'}>
                            {p.quantity}
                          </span>
                          <button
                            onClick={() => onQuickQuantityChange(p.id, 1)}
                            title="Increase 1"
                            className="w-4 h-4 rounded flex items-center justify-center text-[#8b92ab] hover:text-white cursor-pointer"
                          >
                            <PlusIcon className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center text-[#8b92ab] font-mono">
                        &lt; {p.lowStockThreshold}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isLow
                              ? 'bg-[#f25c6e]/15 text-[#f25c6e] border border-[#f25c6e]/30'
                              : 'bg-[#22d3a3]/15 text-[#22d3a3] border border-[#22d3a3]/30'
                          }`}
                        >
                          {isLow ? 'Low Stock' : 'AVAILABLE'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#8b92ab] font-mono text-[11px]">
                        {p.createdAt || '9/5/2026'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenEditModal(p.id)}
                            className="px-2.5 py-1 rounded bg-[#5c6ef8]/15 hover:bg-[#5c6ef8] text-[#7b8aff] hover:text-white border border-[#5c6ef8]/30 font-semibold transition-all text-xs cursor-pointer"
                          >
                            ✏ Edit
                          </button>
                          <button
                            onClick={() => onOpenDeleteModal(p.id, p.name)}
                            className="px-2 py-1 rounded bg-[#f25c6e]/15 hover:bg-[#f25c6e] text-[#f25c6e] hover:text-white border border-[#f25c6e]/30 font-semibold transition-all text-xs cursor-pointer"
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#8b92ab]">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Figure 4.3 */}
        <div className="p-4 bg-[#13161e] border-t border-[#2a2f3f] flex items-center justify-center gap-1.5">
          <button
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className="px-3 py-1.5 rounded-lg border border-[#2a2f3f] bg-[#1a1e28] text-xs text-[#8b92ab] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            ‹ Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`min-w-[32px] h-8 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                pageNumber === activePage
                  ? 'bg-[#5c6ef8] text-white shadow-[0_0_12px_rgba(92,110,248,0.4)]'
                  : 'bg-[#1a1e28] border border-[#2a2f3f] text-[#8b92ab] hover:text-white hover:bg-[#222736]'
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-[#2a2f3f] bg-[#1a1e28] text-xs text-[#8b92ab] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Next ›
          </button>
        </div>

      </div>

    </div>
  );
};
