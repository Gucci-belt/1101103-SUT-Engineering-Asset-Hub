import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';
import CustomModal from '../common/CustomModal';

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
        apiFormData.append('description', formData.get('description'));

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

export default ManageAssetModal;
