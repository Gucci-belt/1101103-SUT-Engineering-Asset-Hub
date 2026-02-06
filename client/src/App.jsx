import React, { useState, useEffect } from 'react';
import { useUser, useClerk, SignIn, UserButton } from "@clerk/clerk-react";
import { Toaster } from 'react-hot-toast';
import { API_URL } from './config';
import Navbar from './components/layout/Navbar';
import AuthScreen from './components/auth/AuthScreen';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

const App = () => {
  // --- Global State ---
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'student');
  const [studentId, setStudentId] = useState(localStorage.getItem('studentId') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  const [viewMode, setViewMode] = useState(userRole === 'admin' ? 'admin' : 'student');
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);

  // --- Clerk Hook ---
  const { signOut } = useClerk();
  const { isSignedIn, user, isLoaded } = useUser();

  // --- Auth State Sync ---
  useEffect(() => {
    if (token) {
      fetchAssets();
      if (userRole === 'admin') fetchRequests();
    }
  }, [token, viewMode, userRole]);

  // Sync Clerk -> Local State
  useEffect(() => {
    if (isLoaded && isSignedIn && user && !token) {
      // Mock Login: In a real app, you'd send the Clerk token to backend to get a JWT
      // Here we just mock the session so the UI works
      login({
        token: "mock-clerk-token-" + user.id,
        role: "student", // Default role
        studentId: user.fullName || "Student",
        userId: user.id
      });
    }
  }, [isLoaded, isSignedIn, user, token]);

  const login = (data) => {
    setToken(data.token);
    setUserRole(data.role);
    setStudentId(data.studentId);
    setUserId(data.userId);
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('studentId', data.studentId);
    localStorage.setItem('userId', data.userId);
    setViewMode(data.role === 'admin' ? 'admin' : 'student');
  };

  const logout = () => {
    signOut(); // Sign out from Clerk
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

      const mapped = data.map(a => ({
        ...a,
        image: a.imagePath
          ? (a.imagePath.startsWith('http') ? a.imagePath : `${API_URL.replace('/api', '')}${a.imagePath}`)
          : 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'
      }));
      setAssets(mapped);
    } catch (err) { console.error("Error fetching assets:", err); }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
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

  // --- Loading State (Removed for better UX - app handles undefined states) ---
  // if (!isLoaded) return null; // or show nothing

  // --- Auth Screen (Clerk OR Custom Token) ---
  if (!isSignedIn && !token) {
    return <AuthScreen onLogin={login} />;
  }

  // --- Main App ---
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

export default App;
