import React from 'react';
import { Cpu, LogOut } from 'lucide-react';

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
                    {/* FEATURE TOGGLE: Hide Admin for Demo
                    {user.role === 'admin' && (
                        <button
                            onClick={() => setViewMode(viewMode === 'student' ? 'admin' : 'student')}
                            className="hidden md:block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-orange-200 text-orange-600 rounded-full hover:bg-orange-50 transition-all"
                        >
                            Switch to {viewMode === 'student' ? 'Admin' : 'Student'}
                        </button>
                    )}
                    */}

                    <div className="flex flex-col items-end mr-2">
                        <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{user.role === 'admin' ? 'Admin User' : 'Student User'}</span>
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

export default Navbar;
