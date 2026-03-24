import React from 'react';
import { Star, Trash2, ArrowRightLeft, TrendingUp } from 'lucide-react';

const SavedFavorites = ({ favorites, onRemove, onSelect, user }) => {
  if (!user) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-50 dark:border-gray-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-500">
            <Star size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">Your Favorites</h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Quick access for {user?.name || 'User'}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {favorites.length} Saved
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm">
            <TrendingUp size={24} className="text-gray-300 dark:text-gray-600" />
          </div>
          <div className="max-w-[180px]">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-widest">
              No favorites yet. Click the <Star size={12} className="inline inline-block text-yellow-500" /> on any result to save.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((pair, idx) => (
            <div 
              key={idx}
              className="group relative bg-gray-50/80 dark:bg-gray-900/30 hover:bg-white dark:hover:bg-gray-800 p-5 rounded-3xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 hover:shadow-[0_15px_35px_rgba(37,99,235,0.06)] transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => onSelect(pair.from, pair.to)}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-gray-900 dark:text-white leading-none">{pair.from}</span>
                    <span className="text-[9px] font-black text-gray-400 mt-1">SOURCE</span>
                  </div>
                  <ArrowRightLeft size={14} className="text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-gray-900 dark:text-white leading-none">{pair.to}</span>
                    <span className="text-[9px] font-black text-gray-400 mt-1">TARGET</span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(pair);
                  }}
                  className="p-2 text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-2xl -translate-y-6 translate-x-6"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedFavorites;
