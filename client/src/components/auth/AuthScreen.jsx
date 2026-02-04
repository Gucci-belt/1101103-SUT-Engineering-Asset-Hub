import React, { useState } from 'react';
import { Cpu, AlertCircle, User, Lock, Shield, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';

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

export default AuthScreen;
