"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import AdminTabs from './components/AdminTabs';
import AdminForm from './components/AdminForm';
import AdminList from './components/AdminList';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'project' | 'experience'>('project');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [projects, setProjects] = useState<any[]>([]);
    const [experiences, setExperiences] = useState<any[]>([]);

    // State Form (Gabungan field Project & Experience)
    const [formData, setFormData] = useState<any>({
        title: '', category: 'fullstack', short_desc: '', long_desc: '', tech_stack: '', demo_link: '', repo_link: '', image_url: '',
        role: '', company: '', period: '', type: '', description: ''
    });

    const [isEditingId, setIsEditingId] = useState<number | null>(null);

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

        // Pastikan bucket 'images' (huruf kecil) sudah dibuat di Supabase
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);
        if (uploadError) { setUploading(false); throw uploadError; }

        const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
        setUploading(false);
        return urlData.publicUrl;
    };

    // --- LOGIKA SUBMIT (DIPERBAIKI) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const table = activeTab === 'project' ? 'projects' : 'experience';
            let finalPayload: any = {};

            // 1. FILTER PAYLOAD: Hanya ambil field yang sesuai dengan tabelnya
            if (activeTab === 'project') {
                // Ambil data khusus Project
                finalPayload = {
                    title: formData.title,
                    category: formData.category,
                    short_desc: formData.short_desc,
                    long_desc: formData.long_desc,
                    demo_link: formData.demo_link,
                    repo_link: formData.repo_link,
                    image_url: formData.image_url // Ambil URL lama jika ada
                };

                // Handle Gambar Baru
                if (imageFile) {
                    const publicUrl = await uploadImage();
                    if (publicUrl) finalPayload.image_url = publicUrl;
                }

                // Handle Tech Stack Array
                if (typeof formData.tech_stack === 'string') {
                    finalPayload.tech_stack = formData.tech_stack
                        .split(',')
                        .map((t: string) => t.trim().replace(/['"]+/g, ''))
                        .filter((t: string) => t.length > 0);
                } else {
                    finalPayload.tech_stack = formData.tech_stack;
                }

            } else {
                // Ambil data khusus Experience
                finalPayload = {
                    role: formData.role,
                    company: formData.company,
                    period: formData.period,
                    type: formData.type,
                    description: formData.description
                };
            }

            // 2. KIRIM KE SUPABASE
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
            title: '', category: 'fullstack', short_desc: '', long_desc: '', tech_stack: '', demo_link: '', repo_link: '', image_url: '',
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
        let formItem = { ...formData, ...item }; // Merge dengan state kosong agar field lain tidak undefined

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

                <AdminTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onTabChange={resetForm}
                />

                <AdminForm
                    activeTab={activeTab}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    resetForm={resetForm}
                    isEditingId={isEditingId}
                    loading={loading}
                    uploading={uploading}
                    imagePreview={imagePreview}
                    imageFile={imageFile}
                    handleFileChange={handleFileChange}
                    handleDrop={handleDrop}
                    handleDragOver={handleDragOver}
                    removeImage={removeImage}
                    fileInputRef={fileInputRef}
                />

                <AdminList
                    activeTab={activeTab}
                    data={activeTab === 'project' ? projects : experiences}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}