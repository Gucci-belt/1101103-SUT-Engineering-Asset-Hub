import React from 'react';
import { X } from 'lucide-react';

const CustomModal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 animate-fade-in-up overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

export default CustomModal;
