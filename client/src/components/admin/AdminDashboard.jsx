import React, { useState } from 'react';
import { Package, LogOut, CheckCircle, FileText, Clock, Layers, Plus, CheckCircle as CheckCircleIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';
import StatCard from './StatCard';
import RequestRow from './RequestRow';
import UserManagementTable from './UserManagementTable';
import ManageAssetModal from './ManageAssetModal';

const AdminDashboard = ({ assets, requests, refreshData }) => {
    const [isManageAssetOpen, setIsManageAssetOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null); // If null, we are adding. If set, we are editing.
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'active'

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const activeLoans = requests.filter(r => r.status === 'approved' || r.status === 'borrowed');

    const handleEditClick = (asset) => {
        setEditingAsset(asset);
        setIsManageAssetOpen(true);
    };

    const handleAddClick = () => {
        setEditingAsset(null);
        setIsManageAssetOpen(true);
    };

    const handleDeleteClick = async (assetId) => {
        if (!window.confirm("Are you sure you want to delete this asset? This action cannot be undone.")) return;

        try {
            const res = await fetch(`${API_URL}/assets/${assetId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('Asset deleted successfully');
                refreshData();
            } else {
                toast.error(`Error: ${data.error}`);
            }
        } catch (err) { console.error(err); toast.error("Failed to delete asset."); }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Assets" value={assets.length} icon={Package} color="blue" />
                <StatCard label="Borrowed" value={assets.filter(a => a.status === 'borrowed').length} icon={LogOut} color="orange" />
                <StatCard label="Available" value={assets.filter(a => a.status === 'available').length} icon={CheckCircle} color="emerald" />
                <StatCard label="Requests" value={pendingRequests.length} icon={FileText} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaction Management Section */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Clock size={20} className="text-orange-500" /> Transaction Management
                        </h2>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'pending' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Pending ({pendingRequests.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Active Loans ({activeLoans.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'users' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Users
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[500px]">
                        {activeTab === 'users' ? (
                            <UserManagementTable />
                        ) : (
                            activeTab === 'pending' ? (
                                pendingRequests.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400">
                                        <CheckCircleIcon size={48} className="mx-auto mb-2 opacity-20" />
                                        <p>No pending requests</p>
                                    </div>
                                ) : (
                                    pendingRequests.map(req => (
                                        <RequestRow key={req.id} request={req} onUpdate={refreshData} type="pending" />
                                    ))
                                )
                            ) : (
                                activeLoans.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400">
                                        <Package size={48} className="mx-auto mb-2 opacity-20" />
                                        <p>No active loans</p>
                                    </div>
                                ) : (
                                    activeLoans.map(req => (
                                        <RequestRow key={req.id} request={req} onUpdate={refreshData} type="active" />
                                    ))
                                )
                            ))}
                    </div>
                </div>

                {/* Inventory Management */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Layers size={20} className="text-blue-500" /> Inventory
                        </h2>
                        <button onClick={handleAddClick} className="flex items-center gap-1 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700">
                            <Plus size={14} /> Add Asset
                        </button>
                    </div>
                    <div className="overflow-y-auto max-h-[500px] space-y-2">
                        {assets.map(asset => (
                            <div key={asset.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                                <div className="flex items-center gap-3">
                                    <img src={asset.image} className="w-10 h-10 rounded-md object-cover" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{asset.name}</p>
                                        <p className="text-xs text-slate-500 font-mono">{asset.serialNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${asset.status === 'available' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {asset.status}
                                    </span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(asset)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
                                        </button>
                                        <button onClick={() => handleDeleteClick(asset.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isManageAssetOpen && <ManageAssetModal asset={editingAsset} onClose={() => setIsManageAssetOpen(false)} onSuccess={refreshData} />}
        </div>
    );
};

export default AdminDashboard;
