import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../data/seedData';
import { X, Package, Check, AlertCircle } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: {
    name: string;
    category: string;
    price: number;
    quantity: number;
    lowStockThreshold: number;
  }) => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [threshold, setThreshold] = useState<string>('10');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price.toString());
      setQuantity(productToEdit.quantity.toString());
      setThreshold(productToEdit.lowStockThreshold.toString());
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setQuantity('');
      setThreshold('10');
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!category.trim()) newErrors.category = 'Please select a category';
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = 'Enter a valid non-negative price';
    }
    if (quantity === '' || isNaN(Number(quantity)) || Number(quantity) < 0) {
      newErrors.quantity = 'Enter a valid non-negative quantity';
    }

    const threshNum = threshold === '' ? 10 : Number(threshold);
    if (isNaN(threshNum) || threshNum < 0) {
      newErrors.threshold = 'Threshold must be a non-negative number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      quantity: Number(quantity),
      lowStockThreshold: threshNum,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-body">
      <div 
        className="bg-[#13161e] border border-[#343a50] rounded-2xl w-full max-w-lg shadow-[0_12px_48px_rgba(0,0,0,0.7)] overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2f3f] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5c6ef8]/15 border border-[#5c6ef8]/30 flex items-center justify-center text-[#7b8aff]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-head text-base font-bold text-white">
                {productToEdit ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-[11px] text-[#8b92ab]">
                {productToEdit ? 'Update stock quantity or pricing parameters' : 'Register a new SKU into inventory catalog'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1a1e28] border border-[#2a2f3f] flex items-center justify-center text-[#8b92ab] hover:text-[#f25c6e] hover:border-[#f25c6e]/40 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase font-bold text-[#8b92ab]">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                placeholder="e.g. Wireless Ergonomic Mouse"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] focus:border-[#5c6ef8] focus:ring-2 focus:ring-[#5c6ef8]/20 text-white placeholder-[#555d76] text-xs font-medium outline-none transition-all"
              />
              {errors.name && (
                <p className="text-[11px] text-[#f25c6e] flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase font-bold text-[#8b92ab]">
                Category *
              </label>
              <select
                value={category}
                onChange={e => { setCategory(e.target.value); setErrors(prev => ({ ...prev, category: '' })); }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] focus:border-[#5c6ef8] text-white text-xs font-medium outline-none cursor-pointer"
              >
                <option value="">Select a Category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] text-[#f25c6e] flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" /> {errors.category}
                </p>
              )}
            </div>

            {/* Price & Quantity Grid */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Price */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase font-bold text-[#8b92ab]">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={e => { setPrice(e.target.value); setErrors(prev => ({ ...prev, price: '' })); }}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] focus:border-[#5c6ef8] text-white text-xs font-mono outline-none"
                />
                {errors.price && (
                  <p className="text-[11px] text-[#f25c6e] flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.price}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase font-bold text-[#8b92ab]">
                  Quantity In Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={e => { setQuantity(e.target.value); setErrors(prev => ({ ...prev, quantity: '' })); }}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] focus:border-[#5c6ef8] text-white text-xs font-mono outline-none"
                />
                {errors.quantity && (
                  <p className="text-[11px] text-[#f25c6e] flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> {errors.quantity}
                  </p>
                )}
              </div>

            </div>

            {/* Low Stock Threshold */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase font-bold text-[#8b92ab]">
                Low Stock Threshold (Alert Limit)
              </label>
              <input
                type="number"
                min="0"
                value={threshold}
                onChange={e => setThreshold(e.target.value)}
                placeholder="Default: 10"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] focus:border-[#5c6ef8] text-white text-xs font-mono outline-none"
              />
              <p className="text-[10px] text-[#555d76]">
                When quantity falls below or equals this number, status automatically becomes <span className="text-[#f25c6e] font-mono">LOW_STOCK</span>.
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#1a1e28]/50 border-t border-[#2a2f3f] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b92ab] hover:text-white hover:bg-[#1a1e28] border border-[#2a2f3f] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#5c6ef8] hover:bg-[#7b8aff] text-white text-xs font-bold shadow-[0_0_15px_rgba(92,110,248,0.35)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              {productToEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
