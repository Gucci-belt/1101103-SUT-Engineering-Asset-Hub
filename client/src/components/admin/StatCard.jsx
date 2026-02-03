import React from 'react';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">{label}</p>
        </div>
    </div>
);

export default StatCard;
