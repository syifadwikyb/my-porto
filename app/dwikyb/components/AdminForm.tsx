import React from 'react';
import { Edit, Plus, Save, X, UploadCloud } from 'lucide-react';

interface AdminFormProps {
    // PERBAIKAN 1: Tambahkan '| null' agar tipe datanya cocok
    fileInputRef: React.RefObject<HTMLInputElement | null>;

    activeTab: 'project' | 'experience';
    formData: any;
    setFormData: (data: any) => void;
    handleSubmit: (e: React.FormEvent) => void;
    resetForm: () => void;
    isEditingId: number | null;
    loading: boolean;
    uploading: boolean;
    imagePreview: string | null;
    imageFile: File | null;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleDragOver: (e: React.DragEvent) => void;
    removeImage: () => void;
}

export default function AdminForm({
    fileInputRef,
    activeTab, formData, setFormData, handleSubmit, resetForm, isEditingId, loading, uploading,
    imagePreview, imageFile, handleFileChange, handleDrop, handleDragOver, removeImage
}: AdminFormProps) {

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-slate-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
                {isEditingId ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-green-500" />}
                {isEditingId ? `Edit ${activeTab}` : `Tambah ${activeTab} Baru`}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">

                {activeTab === 'project' ? (
                    <>
                        {/* PERBAIKAN 2: Tambahkan || '' di semua value */}
                        <input required type="text" placeholder="Judul Proyek" className="input-field"
                            value={formData.title || ''}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />

                        <select className="input-field"
                            value={formData.category || 'fullstack'}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="fullstack">Fullstack</option>
                            <option value="uiux">UI/UX</option>
                        </select>

                        {/* Area Upload Gambar */}
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition relative"
                            onDragOver={handleDragOver} onDrop={handleDrop}>

                            <input type="file" accept="image/*" ref={fileInputRef} hidden onChange={handleFileChange} />

                            {imagePreview ? (
                                <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden group">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    {(imageFile || (isEditingId && formData.image_url)) && (
                                        <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="py-8 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <UploadCloud size={40} className="mx-auto text-slate-400 mb-2" />
                                    <p className="text-slate-600 font-medium">Klik untuk upload atau drag & drop gambar</p>
                                    <p className="text-slate-400 text-sm">JPG, PNG (Max. 5MB)</p>
                                </div>
                            )}
                        </div>

                        <input required type="text" placeholder="Deskripsi Singkat" className="input-field"
                            value={formData.short_desc || ''}
                            onChange={e => setFormData({ ...formData, short_desc: e.target.value })}
                        />

                        <textarea required placeholder="Deskripsi Panjang (Detail)" className="input-field h-28"
                            value={formData.long_desc || ''}
                            onChange={e => setFormData({ ...formData, long_desc: e.target.value })}
                        />

                        <input type="text" placeholder="Tech Stack (Pisahkan dengan koma: React, Nextjs, CSS)" className="input-field"
                            value={formData.tech_stack || ''}
                            onChange={e => setFormData({ ...formData, tech_stack: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Link Demo" className="input-field"
                                value={formData.demo_link || ''}
                                onChange={e => setFormData({ ...formData, demo_link: e.target.value })}
                            />
                            <input type="text" placeholder="Link Repo/Github" className="input-field"
                                value={formData.repo_link || ''}
                                onChange={e => setFormData({ ...formData, repo_link: e.target.value })}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <input required type="text" placeholder="Role / Posisi (misal: Frontend Dev)" className="input-field"
                            value={formData.role || ''}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        />
                        <input required type="text" placeholder="Nama Perusahaan" className="input-field"
                            value={formData.company || ''}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input required type="text" placeholder="Periode (misal: 2023 - Sekarang)" className="input-field"
                                value={formData.period || ''}
                                onChange={e => setFormData({ ...formData, period: e.target.value })}
                            />
                            <input required type="text" placeholder="Tipe (Fulltime/Freelance)" className="input-field"
                                value={formData.type || ''}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            />
                        </div>
                        <textarea required placeholder="Deskripsi Pekerjaan" className="input-field h-28"
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </>
                )}

                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button disabled={loading || uploading} type="submit" className={`px-6 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 transition shadow-sm ${loading || uploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow'}`}>
                        <Save size={18} />
                        {uploading ? 'Mengupload Gambar...' : (loading ? 'Menyimpan...' : (isEditingId ? 'Update Data' : 'Simpan Data'))}
                    </button>
                    {isEditingId && (
                        <button type="button" onClick={resetForm} className="bg-white text-slate-600 px-6 py-2.5 rounded-lg font-bold border border-slate-200 hover:bg-slate-50 flex items-center gap-2 transition shadow-sm">
                            <X size={18} /> Batal
                        </button>
                    )}
                </div>
            </form>

            <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.875rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s;
          background-color: #f8fafc;
        }
        .input-field:focus {
          border-color: #3b82f6;
          background-color: #fff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        textarea.input-field { resize: vertical; }
      `}</style>
        </div>
    );
}