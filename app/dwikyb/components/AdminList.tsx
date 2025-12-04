import React from 'react';
import { Trash2, Edit, UploadCloud, Image as ImageIcon } from 'lucide-react';

interface AdminListProps {
    activeTab: 'project' | 'experience';
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: number) => void;
}

export default function AdminList({ activeTab, data, onEdit, onDelete }: AdminListProps) {
    return (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2">
                {activeTab === 'project' ? <ImageIcon size={18} /> : <UploadCloud size={18} />}
                List {activeTab === 'project' ? 'Proyek' : 'Pengalaman'}
            </div>

            <div className="divide-y divide-slate-100">
                {data.map((item) => (
                    <div key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition group">
                        <div className="flex items-center gap-4">
                            {/* Thumbnail Gambar (Khusus Project) */}
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
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.category === 'fullstack' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{item.category}</span>
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

                        {/* Tombol Aksi */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {data.length === 0 && (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                        <UploadCloud size={40} className="text-slate-300" />
                        <p>Belum ada data di kategori ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
}