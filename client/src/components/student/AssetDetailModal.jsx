import React from 'react';
import { Cpu, FileText, Package, XCircle } from 'lucide-react';
import CustomModal from '../common/CustomModal';

const AssetDetailModal = ({ asset, onClose, onBorrow }) => {
    if (!asset) return null;
    return (
        <CustomModal title="Asset Details" onClose={onClose}>
            <div className="space-y-6">
                <div className="relative h-64 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                    <img src={asset.image} className="w-full h-full object-cover" alt={asset.name} />
                    <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase text-white shadow-sm ${asset.status === 'available' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                        {asset.status}
                    </span>
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{asset.name}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-200">{asset.category}</span>
                            <span className="text-slate-400 text-sm font-mono flex items-center gap-1"><Cpu size={14} /> {asset.serialNumber}</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><FileText size={16} /> Description</h4>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {asset.description || "No description provided."}
                        </p>
                    </div>

                    {asset.status === 'available' ? (
                        <button onClick={onBorrow} className="w-full py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2">
                            <Package size={20} /> Borrow This Item
                        </button>
                    ) : (
                        <div className="w-full py-3.5 bg-slate-100 text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                            <XCircle size={20} /> Currently Unavailable
                        </div>
                    )}
                </div>
            </div>
        </CustomModal>
    );
};

export default AssetDetailModal;
