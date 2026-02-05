import React, { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';
import AssetCard from '../common/AssetCard';
import BorrowModal from './BorrowModal';
import AssetDetailModal from './AssetDetailModal';

const StudentDashboard = ({ assets, refreshAssets, studentId, userId }) => {
    const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'history'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [detailAsset, setDetailAsset] = useState(null); // For Viewing Details <--- ADDED
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [history, setHistory] = useState([]);

    const categories = ['All', 'IoT', 'Laptop', 'Network', 'Accessories'];

    const handleAssetClick = (asset) => {
        setDetailAsset(asset);
    };

    useEffect(() => {
        if (activeTab === 'history' && userId) {
            fetchHistory();
        }
    }, [activeTab, userId]);

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_URL}/transactions/my-history?userId=${userId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setHistory(data);
        } catch (err) { console.error("Failed to fetch history", err); }
    };

    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (asset.serialNumber && asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleCancelRequest = async (transactionId) => {
        if (!confirm("Are you sure you want to cancel this request?")) return;
        try {
            const res = await fetch(`${API_URL}/transactions/${transactionId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success("Request cancelled");
                fetchHistory();
            } else {
                const data = await res.json();
                toast.error(data.error);
            }
        } catch (err) { toast.error("Failed to cancel"); }
    };

    const handleBorrowClick = (asset) => {
        if (asset.status !== 'available') return;
        setSelectedAsset(asset);
        setIsBorrowModalOpen(true);
    };

    return (
        <>
            {/* Hero Section */}
            <div className="relative bg-white border-b border-slate-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50/50 z-0"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                                ระบบจองและติดตาม<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                                    สถานะอุปกรณ์ห้องปฏิบัติการ
                                </span>
                            </h1>
                            <p className="text-slate-600 text-lg">Computer Engineering Lab Asset Management System</p>
                        </div>

                        <div className="flex flex-wrap justify-center bg-white/60 p-1.5 rounded-2xl border border-slate-200 backdrop-blur-sm">
                            <button
                                onClick={() => setActiveTab('browse')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'browse' ? 'bg-white text-orange-600 shadow-md shadow-orange-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Search size={18} /> Browse
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-white text-orange-600 shadow-md shadow-orange-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Clock size={18} /> My History
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {activeTab === 'browse' ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                    {/* Filters */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2.5 w-full bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAssets.map(asset => (
                            <AssetCard
                                key={asset.id}
                                asset={asset}
                                onBorrow={() => handleBorrowClick(asset)}
                                onClick={() => handleAssetClick(asset)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto px-4 py-8 relative z-20">
                    {history.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500">No transaction history found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map(item => (
                                <div key={item.id} className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                            item.status === 'approved' || item.status === 'borrowed' ? 'bg-emerald-100 text-emerald-600' :
                                                item.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {item.status === 'pending' ? <Clock size={20} /> :
                                                item.status === 'rejected' ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{item.asset?.name || 'Unknown Item'}</h3>
                                            <p className="text-xs text-slate-500 font-mono">SN: {item.asset?.serialNumber} • Request Date: {new Date(item.borrowDate).toLocaleDateString()}</p>
                                            {item.status === 'approved' && (
                                                <p className="text-xs text-orange-600 font-bold mt-1">Due Date: {new Date(item.dueDate).toLocaleDateString()}</p>
                                            )}
                                            {item.status === 'returned' && (
                                                <p className="text-xs text-emerald-600 font-bold mt-1">Returned on: {new Date(item.returnDate).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-lg ${item.status === 'pending' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                        item.status === 'approved' || item.status === 'borrowed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            item.status === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                                        }`}>
                                        {item.status}
                                    </span>

                                    {item.status === 'pending' && (
                                        <button
                                            onClick={() => handleCancelRequest(item.id)}
                                            className="ml-4 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                            title="Cancel Request"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isBorrowModalOpen && selectedAsset && (
                <BorrowModal asset={selectedAsset} onClose={() => setIsBorrowModalOpen(false)} onSuccess={() => { refreshAssets(); setActiveTab('history'); }} currentUserId={userId} />
            )}

            {/* Asset Detail Modal */}
            {detailAsset && (
                <AssetDetailModal
                    asset={detailAsset}
                    onClose={() => setDetailAsset(null)}
                    onBorrow={() => {
                        setDetailAsset(null);
                        handleBorrowClick(detailAsset);
                    }}
                />
            )}
        </>
    );
};

export default StudentDashboard;
