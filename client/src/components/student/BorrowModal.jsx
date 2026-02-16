import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';
import CustomModal from '../common/CustomModal';

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

export default BorrowModal;
