import React, { useState } from 'react';
import { Clock, Monitor } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';

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

export default RequestRow;
