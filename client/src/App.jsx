import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
  Search, Monitor, Cpu, Wifi, MousePointer, Filter, Clock, CheckCircle, XCircle,
  Calendar, User, LogOut, AlertCircle, Package, Layers, Plus, Upload, MoreVertical,
  Settings, FileText, Check, X, Shield, Lock, ArrowRight, Loader2, Inbox, Trash2
} from 'lucide-react';

// --- API Helper ---
// Dynamically determine API URL based on current hostname to support mobile/PWA testing
// If on localhost, uses localhost:3000. If on 192.168.x.x, uses 192.168.x.x:3000
const API_URL = `http://${window.location.hostname}:3000/api`;

const App = () => {
  // --- Global State ---
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'student');
  const [studentId, setStudentId] = useState(localStorage.getItem('studentId') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  const [viewMode, setViewMode] = useState(userRole === 'admin' ? 'admin' : 'student');
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);

  // --- Auth State ---
  useEffect(() => {
    if (token) {
      fetchAssets();
      if (userRole === 'admin') fetchRequests();
    }
  }, [token, viewMode, userRole]); // Added userRole to dependencies

  const login = (data) => {
    setToken(data.token);
    setUserRole(data.role);
    setStudentId(data.studentId);
    setUserId(data.userId); // Store userId
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('studentId', data.studentId);
    localStorage.setItem('userId', data.userId);
    setViewMode(data.role === 'admin' ? 'admin' : 'student');
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    setStudentId('');
    setUserId(null);
    localStorage.clear();
  };

  const fetchAssets = async () => {
    try {
      const res = await fetch(`${API_URL}/assets`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid assets data:", data);
        return;
      }

      // Map API data to UI format if needed, or use directly
      // Adjusting image path to full URL
      const mapped = data.map(a => ({
        ...a,
        image: a.imagePath ? (a.imagePath.startsWith('http') ? a.imagePath : `${API_URL.replace('/api', '')}${a.imagePath}`) : 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'
      }));
      setAssets(mapped);
    } catch (err) { console.error("Error fetching assets:", err); }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include token for authenticated requests
        }
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        console.error("Invalid requests data:", data);
      }
    } catch (err) { console.error("Error fetching requests:", err); }
  };

  if (!token) {
    return <AuthScreen onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Prompt',_sans-serif] text-slate-800 pb-20">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar viewMode={viewMode} setViewMode={setViewMode} user={{ role: userRole, studentId }} onLogout={logout} />

      {viewMode === 'student' ? (
        <StudentDashboard assets={assets} refreshAssets={fetchAssets} studentId={studentId} userId={userId} />
      ) : (
        <AdminDashboard assets={assets} requests={requests} refreshData={() => { fetchAssets(); fetchRequests(); }} />
      )}
    </div>
  );
};

// --- Auth Components ---

const AuthScreen = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', password: '', role: 'student' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isReset ? '/auth/reset-password' : (isRegister ? '/auth/register' : '/auth/login');
    const body = isReset
      ? { studentId: formData.studentId, newPassword: formData.password, pin: formData.pin }
      : formData; // Register uses formData directly which now includes pin

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      if (isReset) {
        toast.success('Password reset successfully! Please login.');
        setIsReset(false);
        setIsRegister(false);
      } else if (isRegister) {
        toast.success('Registration successful! Please login.');
        setIsRegister(false);
      } else {
        toast.success('Login successful!');
        onLogin(data);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center p-4 font-['Prompt']">
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-8 text-center bg-orange-50 border-b border-orange-100">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500 shadow-inner">
            <Cpu size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">SUT<span className="text-orange-600">Assets</span></h1>
          <p className="text-slate-500 text-sm">ระบบจองและติดตามสถานะอุปกรณ์</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
            {isReset ? 'Reset Password' : (isRegister ? 'Create Account' : 'Welcome Back')}
          </h2>

          {error && (
            <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 border border-rose-100">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Student ID / Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                  placeholder="B6xxxxxx"
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                {isReset ? 'New Password' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {(isRegister || isReset) && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Security PIN (4 Digits)
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    maxLength="4"
                    pattern="\d{4}"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none transition-all tracking-widest"
                    placeholder="1234"
                    value={formData.pin || ''}
                    onChange={e => setFormData({ ...formData, pin: e.target.value })}
                  />
                </div>
                {isRegister && <p className="text-[10px] text-slate-400 mt-1">* Remember this PIN for password recovery</p>}
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              {isReset ? 'Reset Password' : (isRegister ? 'Sign Up' : 'Login')} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {!isReset && (
              <p className="text-sm text-slate-500">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                <button onClick={() => setIsRegister(!isRegister)} className="ml-2 text-orange-600 font-bold hover:underline">
                  {isRegister ? 'Login' : 'Register'}
                </button>
              </p>
            )}

            <button onClick={() => { setIsReset(!isReset); setIsRegister(false); setError(''); }} className="text-xs text-slate-400 hover:text-slate-600 underline">
              {isReset ? 'Back to Login' : 'Forgot Password?'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- App Components (Updated) ---

const Navbar = ({ viewMode, setViewMode, user, onLogout }) => (
  <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-orange-500 to-amber-500 p-2.5 rounded-xl text-white shadow-lg shadow-orange-200">
            <Cpu size={24} />
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              SUT<span className="text-orange-600">Assets</span>
            </span>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide -mt-1">BORROWING SYSTEM</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user.role === 'admin' && (
            <button
              onClick={() => setViewMode(viewMode === 'student' ? 'admin' : 'student')}
              className="hidden md:block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-orange-200 text-orange-600 rounded-full hover:bg-orange-50 transition-all"
            >
              Switch to {viewMode === 'student' ? 'Admin' : 'Student'}
            </button>
          )}

          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-semibold text-slate-700">{user.role === 'admin' ? 'Admin User' : 'Student User'}</span>
            <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
              {user.studentId}
            </span>
          </div>
          <button onClick={onLogout} className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  </nav>
);

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

            <div className="flex bg-white/60 p-1.5 rounded-2xl border border-slate-200 backdrop-blur-sm">
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
            <div className="flex gap-2 overflow-x-auto">
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

const BorrowModal = ({ asset, onClose, onSuccess, currentUserId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const returnDate = formData.get('returnDate');
    const reason = formData.get('reason');

    try {
      const res = await fetch(`${API_URL}/transactions/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId: currentUserId, assetId: asset.id, dueDate: returnDate, reason: reason })
      });

      if (res.ok) {
        toast.success('Borrow request submitted successfully!');
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error submitting request');
      }
    } catch (err) { toast.error('Error: ' + err.message); }
    setIsLoading(false);
  };

  return (
    <CustomModal title={`Borrow: ${asset.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Return Date</label>
          <input type="date" name="returnDate" required className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
          <textarea rows="3" name="reason" required className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20"></textarea>
        </div>
        <button disabled={isLoading} type="submit" className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Request'}
        </button>
      </form>
    </CustomModal>
  );
};

// --- Admin Section ---

// --- Admin Section ---

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
                    <CheckCircle size={48} className="mx-auto mb-2 opacity-20" />
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

const UserManagementTable = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) { console.error("Failed to fetch users"); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure? This will delete the user and ALL their history.")) return;
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) { toast.success("User deleted"); fetchUsers(); }
      else { const d = await res.json(); toast.error(d.error); }
    } catch (err) { toast.error("Failed"); }
  };

  return (
    <div className="space-y-2">
      {users.map(u => (
        <div key={u.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><User size={16} /></div>
            <div>
              <p className="text-sm font-bold text-slate-700">{u.studentId}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">{u.role}</p>
            </div>
          </div>
          {u.role !== 'admin' && (
            <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

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

const RequestRow = ({ request, onUpdate, type }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action) => {
    setIsLoading(true);
    try {
      const endpoint = `${API_URL}/admin/transactions/${request.id}/${action}`;
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.error}`);
      } else {
        toast.success(`Request ${action}ed successfully`);
        onUpdate();
      }
    } catch (err) { console.error(err); toast.error('Failed to process request'); }
    setIsLoading(false);
  };

  return (
    <div className="p-4 border border-slate-100 rounded-xl mb-3 bg-slate-50">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
            {type === 'pending' ? <Clock size={20} /> : <Monitor size={20} />}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{request.asset?.name || 'Unknown Asset'}</p>
            <p className="text-xs text-slate-500">Student: {request.user?.studentId || request.userId}</p>
            {request.reason && <p className="text-xs text-slate-500 italic mt-0.5">"{request.reason}"</p>}
          </div>
        </div>
        <div className="text-right">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${type === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
            {request.status}
          </span>
          <p className="text-[10px] text-slate-400 mt-1">
            Due: {new Date(request.dueDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
        {type === 'pending' ? (
          <>
            <button disabled={isLoading} onClick={() => handleAction('reject')} className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50">
              Reject
            </button>
            <button disabled={isLoading} onClick={() => handleAction('approve')} className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 shadow-sm shadow-emerald-200 transition-colors disabled:opacity-50">
              {isLoading ? '...' : 'Approve'}
            </button>
          </>
        ) : (
          <button disabled={isLoading} onClick={() => handleAction('return')} className="px-3 py-1.5 text-xs font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-sm shadow-blue-200 transition-colors disabled:opacity-50">
            {isLoading ? '...' : 'Mark as Returned'}
          </button>
        )}
      </div>
    </div>
  );
};

// --- Modal for Asset Details ---
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

const ManageAssetModal = ({ asset, onClose, onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(asset?.imagePath ? (asset.imagePath.startsWith('http') ? asset.imagePath : `http://localhost:3000${asset.imagePath}`) : null);
  const isEdit = !!asset;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.target);

    // Explicitly construction for backend compatibility
    const apiFormData = new FormData();
    apiFormData.append('name', formData.get('name'));
    apiFormData.append('serialNumber', formData.get('serialNumber'));
    apiFormData.append('category', formData.get('category'));
    apiFormData.append('status', isEdit ? asset.status : 'available');
    apiFormData.append('description', formData.get('description')); // <--- Added

    const imageFile = formData.get('imageFile');
    if (imageFile && imageFile.size > 0) {
      apiFormData.append('image', imageFile);
    } else if (isEdit && asset.imagePath) {
      apiFormData.append('imagePath', asset.imagePath);
    }

    try {
      const url = isEdit ? `${API_URL}/assets/${asset.id}` : `${API_URL}/assets`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: apiFormData
      });

      if (res.ok) {
        toast.success(`Asset ${isEdit ? 'updated' : 'created'} successfully!`);
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.error || `Failed to ${isEdit ? 'update' : 'create'} asset`);
      }
    } catch (err) { console.error(err); toast.error(`Error ${isEdit ? 'updating' : 'creating'} asset`); }
    setUploading(false);
  };

  return (
    <CustomModal title={isEdit ? "Edit Asset" : "Add New Asset"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asset Name</label>
          <input name="name" defaultValue={asset?.name} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-medium" placeholder="Ex. MacBook Pro M1" />
        </div>

        {/* Added Description Field */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
          <textarea name="description" defaultValue={asset?.description} rows="3" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-medium" placeholder="Enter detailed description here..."></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Serial Number</label>
            <input name="serialNumber" defaultValue={asset?.serialNumber} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-mono" placeholder="SN-1234" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
            <div className="relative">
              <select name="category" defaultValue={asset?.category} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none appearance-none font-medium cursor-pointer focus:ring-2 focus:ring-orange-500/20">
                <option value="IoT">IoT Device</option>
                <option value="Laptop">Laptop / PC</option>
                <option value="Network">Network Gear</option>
                <option value="Accessories">Accessories</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asset Image</label>
          <div className="relative group">
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${preview ? 'border-orange-500 bg-orange-50/10' : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'}`}>
              {preview ? (
                <div className="relative h-48 w-full mx-auto rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-bold flex items-center gap-2"><Upload size={16} /> Change Image</p>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Upload size={28} />
                  </div>
                  <h4 className="text-slate-700 font-bold text-sm mb-1">Click to upload image</h4>
                  <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button disabled={uploading} type="submit" className="w-full py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
          {uploading ? <Loader2 className="animate-spin" size={20} /> : (isEdit ? 'Save Changes' : 'Create Asset')}
        </button>
      </form>
    </CustomModal>
  );
};

export default App;
