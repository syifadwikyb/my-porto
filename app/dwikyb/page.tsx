"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Edit, Plus, Save, X, UploadCloud, Image as ImageIcon } from 'lucide-react';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'project' | 'experience'>('project');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [projects, setProjects] = useState<any[]>([]);
    const [experiences, setExperiences] = useState<any[]>([]);

    // State Form
    const [formData, setFormData] = useState<any>({
        title: '', category: '', short_desc: '', long_desc: '', tech_stack: '', demo_link: '', repo_link: '', image_url: '',
        role: '', company: '', period: '', type: '', description: ''
    });

    const [isEditingId, setIsEditingId] = useState<number | null>(null);

    // State Gambar
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = async () => {
        setLoading(true);
        const { data: pData } = await supabase.from('projects').select('*').order('id', { ascending: false });
        if (pData) setProjects(pData);

        const { data: eData } = await supabase.from('experience').select('*').order('id', { ascending: false });
        if (eData) setExperiences(eData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- LOGIKA UPLOAD ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (isEditingId && activeTab === 'project') {
            const originalProject = projects.find(p => p.id === isEditingId);
            setImagePreview(originalProject?.image_url || null);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return null;
        setUploading(true);
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);
        if (uploadError) { setUploading(false); throw uploadError; }

        const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
        setUploading(false);
        return urlData.publicUrl;
    };

    // --- LOGIKA SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const table = activeTab === 'project' ? 'projects' : 'experience';
            let finalPayload: any = {};

            if (activeTab === 'project') {
                finalPayload = {
                    title: formData.title,
                    category: formData.category, // Data kategori diambil dari input teks
                    short_desc: formData.short_desc,
                    long_desc: formData.long_desc,
                    demo_link: formData.demo_link || null,
                    repo_link: formData.repo_link || null,
                    image_url: formData.image_url
                };

                if (imageFile) {
                    const publicUrl = await uploadImage();
                    if (publicUrl) finalPayload.image_url = publicUrl;
                }

                if (typeof formData.tech_stack === 'string') {
                    finalPayload.tech_stack = formData.tech_stack
                        .split(',')
                        .map((t: string) => t.trim().replace(/['"]+/g, ''))
                        .filter((t: string) => t.length > 0);
                } else {
                    finalPayload.tech_stack = formData.tech_stack;
                }

            } else {
                finalPayload = {
                    role: formData.role,
                    company: formData.company,
                    period: formData.period,
                    type: formData.type,
                    description: formData.description
                };
            }

            let error;
            if (isEditingId) {
                const { error: err } = await supabase.from(table).update(finalPayload).eq('id', isEditingId);
                error = err;
            } else {
                const { error: err } = await supabase.from(table).insert([finalPayload]);
                error = err;
            }

            if (!error) {
                alert("Berhasil disimpan!");
                resetForm();
                fetchData();
            } else {
                throw error;
            }
        } catch (error: any) {
            alert("Gagal: " + error.message);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setFormData({
            title: '', category: '', short_desc: '', long_desc: '', tech_stack: '', demo_link: '', repo_link: '', image_url: '',
            role: '', company: '', period: '', type: '', description: ''
        });
        setIsEditingId(null);
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin mau hapus?")) return;
        const table = activeTab === 'project' ? 'projects' : 'experience';
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (!error) { fetchData(); } else { alert("Gagal hapus: " + error.message); }
    };

    const handleEdit = (item: any) => {
        setIsEditingId(item.id);
        let formItem = { ...formData, ...item };

        if (activeTab === 'project' && Array.isArray(item.tech_stack)) {
            formItem.tech_stack = item.tech_stack.join(', ');
        }
        setFormData(formItem);

        if (activeTab === 'project' && item.image_url) {
            setImagePreview(item.image_url);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-slate-800">Halaman Admin Rahasia 🤫</h1>

                {/* Tab Switcher */}
                <div className="flex gap-4 mb-8">
                    <button onClick={() => { setActiveTab('project'); resetForm(); }} className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'project' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Manage Projects</button>
                    <button onClick={() => { setActiveTab('experience'); resetForm(); }} className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'experience' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Manage Experience</button>
                </div>

                {/* FORM INPUT */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-slate-200">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
                        {isEditingId ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-green-500" />}
                        {isEditingId ? `Edit ${activeTab}` : `Tambah ${activeTab} Baru`}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">

                        {activeTab === 'project' ? (
                            <>
                                <input required type="text" placeholder="Judul Proyek" className="input-field"
                                    value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />

                                {/* --- BAGIAN YANG DIUBAH: DARI SELECT MENJADI INPUT TEXT --- */}
                                <input
                                    required
                                    type="text"
                                    placeholder="Kategori (contoh: Fullstack, UI/UX, Mobile App)"
                                    className="input-field"
                                    value={formData.category || ''}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                />
                                {/* --------------------------------------------------------- */}

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
                                    value={formData.short_desc || ''} onChange={e => setFormData({ ...formData, short_desc: e.target.value })} />

                                <textarea required placeholder="Deskripsi Panjang (Detail)" className="input-field h-28"
                                    value={formData.long_desc || ''} onChange={e => setFormData({ ...formData, long_desc: e.target.value })} />

                                <input type="text" placeholder="Tech Stack (Pisahkan dengan koma: React, Nextjs, CSS)" className="input-field"
                                    value={formData.tech_stack || ''} onChange={e => setFormData({ ...formData, tech_stack: e.target.value })} />

                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Link Demo (Opsional)" className="input-field"
                                        value={formData.demo_link || ''} onChange={e => setFormData({ ...formData, demo_link: e.target.value })} />
                                    <input type="text" placeholder="Link Repo/Github (Opsional)" className="input-field"
                                        value={formData.repo_link || ''} onChange={e => setFormData({ ...formData, repo_link: e.target.value })} />
                                </div>
                            </>
                        ) : (
                            // FORM EXPERIENCE
                            <>
                                <input required type="text" placeholder="Role / Posisi (misal: Frontend Dev)" className="input-field"
                                    value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                <input required type="text" placeholder="Nama Perusahaan" className="input-field"
                                    value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="text" placeholder="Periode (misal: 2023 - Sekarang)" className="input-field"
                                        value={formData.period || ''} onChange={e => setFormData({ ...formData, period: e.target.value })} />
                                    <input required type="text" placeholder="Tipe (Fulltime/Freelance)" className="input-field"
                                        value={formData.type || ''} onChange={e => setFormData({ ...formData, type: e.target.value })} />
                                </div>
                                <textarea required placeholder="Deskripsi Pekerjaan" className="input-field h-28"
                                    value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
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
                </div>

                {/* LIST DATA */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2">
                        {activeTab === 'project' ? <ImageIcon size={18} /> : <UploadCloud size={18} />}
                        List {activeTab === 'project' ? 'Proyek' : 'Pengalaman'}
                    </div>

                    <div className="divide-y divide-slate-100">
                        {(activeTab === 'project' ? projects : experiences).map((item) => (
                            <div key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition group">
                                <div className="flex items-center gap-4">
                                    {activeTab === 'project' && (
                                        <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
                                            <img src={item.image_url || "/api/placeholder/100/100"} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-slate-900">
                                            {activeTab === 'project' ? item.title : item.role}
                                        </div>
                                        <div className="text-sm text-slate-500 flex items-center gap-2">
                                            {activeTab === 'project' ? (
                                                <>
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                                                        {item.category}
                                                    </span>
                                                    <span className="text-xs text-slate-400 truncate max-w-[200px]">
                                                        {Array.isArray(item.tech_stack) ? item.tech_stack.join(', ') : item.tech_stack}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>{item.company} • {item.type}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

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