import React from 'react';
import { Package } from 'lucide-react';
import { API_URL } from '../../config';

const AssetCard = ({ asset, onBorrow, onClick }) => {
    const isAvailable = asset.status === 'available';
    return (
        <div onClick={onClick} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 transition-all overflow-hidden flex flex-col cursor-pointer">
            <div className="relative h-56 bg-slate-100">
                <img src={asset.image} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    {asset.status}
                </div>
            </div>
            <div className="p-6 relative">
                <div className="absolute -top-6 right-6">
                    <button onClick={(e) => { e.stopPropagation(); onBorrow(); }} disabled={!isAvailable}
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${isAvailable ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                        <Package size={20} />
                    </button>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded-md">{asset.category}</span>
                <h3 className="text-lg font-bold text-slate-800 mt-2 mb-1 truncate">{asset.name}</h3>
                <p className="text-slate-500 text-xs font-mono">{asset.serialNumber}</p>
            </div>
        </div>
    );
};

export default AssetCard;
