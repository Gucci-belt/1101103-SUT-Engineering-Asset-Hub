import React, { useState } from 'react';
import { useSignIn } from "@clerk/clerk-react";
import { Cpu, AlertCircle, User, Lock, Shield, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';

const AuthScreen = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [formData, setFormData] = useState({ studentId: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const { signIn, isLoaded } = useSignIn();

    const handleGoogleLogin = async () => {
        if (!isLoaded) return;
        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/"
            });
        } catch (err) {
            console.error("OAuth error", err);
            toast.error("Google Login Failed");
        }
    };

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

                        {!isReset && !isRegister && (
                            <div className="mt-4">
                                <div className="relative flex py-2 items-center">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase">Or continue with</span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>
                            </div>
                        )}
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
