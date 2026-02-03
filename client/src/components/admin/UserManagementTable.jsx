import React, { useState, useEffect } from 'react';
import { User, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';

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

export default UserManagementTable;
