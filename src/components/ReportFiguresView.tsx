import React, { useState } from 'react';
import { REPORT_FIGURES } from '../data/seedData';
import { Image, Layers, ExternalLink, ZoomIn, CheckCircle2, FileText } from 'lucide-react';

export const ReportFiguresView: React.FC = () => {
  const [selectedFigure, setSelectedFigure] = useState<typeof REPORT_FIGURES[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Architecture', 'Workflow', 'Database', 'Codebase', 'Execution Snapshot'];

  const filteredFigures = REPORT_FIGURES.filter(fig => {
    if (activeCategory === 'ALL') return true;
    return fig.category === activeCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2a2f3f]">
        <div>
          <h1 className="font-head text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Project Diagrams &amp; Execution Snapshots
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#5c6ef8]/15 text-[#7b8aff] border border-[#5c6ef8]/30">
              8 Figures from Project Report
            </span>
          </h1>
          <p className="text-sm text-[#8b92ab] mt-1">
            Official System Architecture (Fig 3.1), Workflow Flowchart (Fig 3.2), ER Diagram (Fig 3.3), Spring Package Structure (Fig 3.4), and Render Execution Snapshots (Figs 4.1–4.4).
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#13161e] p-1 rounded-xl border border-[#2a2f3f]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#5c6ef8] text-white shadow-[0_0_10px_rgba(92,110,248,0.3)]'
                  : 'text-[#8b92ab] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of figures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFigures.map(fig => (
          <div
            key={fig.id}
            onClick={() => setSelectedFigure(fig)}
            className="group bg-[#13161e] border border-[#2a2f3f] hover:border-[#5c6ef8]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#1a1e28] border-b border-[#2a2f3f] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#7b8aff]">
                  {fig.figureNumber}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#5c6ef8]/10 text-[#7b8aff] border border-[#5c6ef8]/20">
                  {fig.category}
                </span>
              </div>
              <span className="text-[11px] text-[#8b92ab] flex items-center gap-1 group-hover:text-white">
                <ZoomIn className="w-3.5 h-3.5" />
                Click to Enlarge
              </span>
            </div>

            {/* Thumbnail Image Container */}
            <div className="relative aspect-[16/10] bg-[#0d0f14] flex items-center justify-center overflow-hidden p-2">
              <img
                src={fig.imagePath}
                alt={fig.title}
                className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between border-t border-[#2a2f3f] bg-[#13161e]">
              <div>
                <h3 className="font-head text-sm font-bold text-white group-hover:text-[#7b8aff] transition-colors">
                  {fig.title}
                </h3>
                <p className="text-xs text-[#8b92ab] mt-1.5 line-clamp-2">
                  {fig.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Figure Zoom Modal */}
      {selectedFigure && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedFigure(null)}
        >
          <div
            className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#1a1e28] border-b border-[#2a2f3f] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#7b8aff]">
                    {selectedFigure.figureNumber}
                  </span>
                  <h3 className="font-head text-base font-bold text-white">
                    {selectedFigure.title}
                  </h3>
                </div>
                <p className="text-xs text-[#8b92ab] mt-0.5">
                  {selectedFigure.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedFigure(null)}
                className="w-8 h-8 rounded-full bg-[#13161e] border border-[#2a2f3f] flex items-center justify-center text-[#8b92ab] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Image display */}
            <div className="flex-1 bg-[#090a0f] p-4 flex items-center justify-center overflow-auto max-h-[75vh]">
              <img
                src={selectedFigure.imagePath}
                alt={selectedFigure.title}
                className="max-h-full max-w-full object-contain rounded-lg shadow-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#13161e] border-t border-[#2a2f3f] flex items-center justify-between text-xs text-[#8b92ab]">
              <span>Category: <strong className="text-white">{selectedFigure.category}</strong></span>
              <button
                onClick={() => setSelectedFigure(null)}
                className="px-4 py-1.5 rounded-lg bg-[#1a1e28] hover:bg-[#222736] text-white text-xs font-medium border border-[#2a2f3f]"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
