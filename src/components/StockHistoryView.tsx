import React, { useState } from 'react';
import { StockHistoryItem } from '../types';

interface StockHistoryViewProps {
  history: StockHistoryItem[];
  onClearHistory?: () => void;
}

export const StockHistoryView: React.FC<StockHistoryViewProps> = ({
  history,
  onClearHistory,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredHistory = history.filter(item => {
    if (filterType === 'ALL') return true;
    return item.changeType === filterType;
  });

  return (
    <div className="space-y-5 animate-fade-in max-w-6xl mx-auto font-body pb-12">
      
      {/* Title Header matching Figure 4.4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 pb-2">
        <div>
          <h1 className="font-head text-3xl font-extrabold text-white tracking-tight">
            Stock History
          </h1>
          <p className="text-sm text-[#8b92ab] mt-1">
            Audit log of all stock changes
          </p>
        </div>

        {/* Quick filter pills */}
        <div className="flex items-center gap-1.5 bg-[#13161e] p-1 rounded-xl border border-[#2a2f3f] self-start sm:self-auto">
          {['ALL', 'ADDED', 'UPDATED', 'DELETED'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-[#5c6ef8] text-white shadow-[0_0_10px_rgba(92,110,248,0.3)]'
                  : 'text-[#8b92ab] hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table matching Figure 4.4 */}
      <div className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a1e28] border-b border-[#2a2f3f] text-[#555d76] font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">PRODUCT</th>
                <th className="py-3.5 px-4 font-bold">CHANGE TYPE</th>
                <th className="py-3.5 px-4 font-bold text-center">OLD QTY</th>
                <th className="py-3.5 px-4 font-bold text-center">NEW QTY</th>
                <th className="py-3.5 px-4 font-bold">CHANGED BY</th>
                <th className="py-3.5 px-4 font-bold text-right">DATE &amp; TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2f3f]/50">
              {filteredHistory.length > 0 ? (
                filteredHistory.map(item => {
                  let badgeStyle = 'bg-[#22d3a3]/15 text-[#22d3a3] border-[#22d3a3]/30';
                  if (item.changeType === 'DELETED') {
                    badgeStyle = 'bg-[#f25c6e]/15 text-[#f25c6e] border-[#f25c6e]/30';
                  } else if (item.changeType === 'UPDATED') {
                    badgeStyle = 'bg-[#f5a623]/15 text-[#f5a623] border-[#f5a623]/30';
                  }

                  return (
                    <tr key={item.id} className="hover:bg-[#1a1e28]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {item.productName}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-3 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase border ${badgeStyle}`}>
                          {item.changeType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-[#8b92ab]">
                        {item.oldQuantity !== null ? item.oldQuantity : '-'}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                        {item.newQuantity !== null ? item.newQuantity : '-'}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#8b92ab]">
                        {item.changedBy}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-[#8b92ab]">
                        {item.changedAt}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8b92ab]">
                    No stock history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & optional clear */}
        {filteredHistory.length > 0 && onClearHistory && (
          <div className="p-3.5 bg-[#13161e] border-t border-[#2a2f3f] flex items-center justify-between text-xs text-[#8b92ab]">
            <span>Audit log tracks real-time inventory alterations</span>
            <button
              onClick={onClearHistory}
              className="text-[#f25c6e] hover:underline font-semibold cursor-pointer"
            >
              Clear Log History
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
