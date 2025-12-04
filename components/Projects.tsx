"use client";
import React, { useState, useEffect } from 'react';
import { Code2, PenTool } from 'lucide-react';
import ProjectModal, { ProjectType } from './ProjectModal';
import { supabase } from '@/lib/supabase'; // Pastikan path ini benar

export default function Projects() {
    const [activeTab, setActiveTab] = useState<'fullstack' | 'uiux'>('fullstack');
    const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);

    // State untuk menyimpan data dari database
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // FETCH DATA DARI SUPABASE
    useEffect(() => {
        async function fetchProjects() {
            setIsLoading(true);

            const { data, error } = await supabase
                .from('projects')
                .select('*');

            if (error) {
                console.error("Error mengambil data:", error.message);
            }

            if (data) {
                const formattedData: ProjectType[] = data.map((item: any) => {

                    // --- LOGIKA PERBAIKAN ARRAY ---
                    let techArray: string[] = [];

                    if (Array.isArray(item.tech_stack)) {
                        // Jika sudah array (tipe kolom json/text[]), pakai langsung
                        techArray = item.tech_stack;
                    } else if (typeof item.tech_stack === 'string') {
                        // Jika string dipisah koma (contoh: "React, Next.js, CSS")
                        // Kita pecah (split) berdasarkan koma
                        techArray = item.tech_stack.split(',').map((t: string) => t.trim());
                    }
                    // -----------------------------

                    return {
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        image: item.image_url || "/api/placeholder/600/400",
                        shortDesc: item.short_desc,
                        longDesc: item.long_desc,
                        tech: techArray, // <--- Ganti ini dengan variabel hasil perbaikan
                        link: item.demo_link,
                        github: item.repo_link
                    };
                });

                setProjects(formattedData);
            }
            setIsLoading(false);
        }

        fetchProjects();
    }, []);

    // Filter project berdasarkan tab aktif
    const filteredProjects = projects.filter(p => p.category === activeTab);

    return (
        <section id="projects" className="py-24 bg-slate-50 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Proyek Saya</h2>

                {/* Tab Controls */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1 rounded-full shadow-sm border border-slate-200 flex gap-2">
                        <button onClick={() => setActiveTab('fullstack')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition ${activeTab === 'fullstack' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>
                            <Code2 size={16} /> Fullstack
                        </button>
                        <button onClick={() => setActiveTab('uiux')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition ${activeTab === 'uiux' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}>
                            <PenTool size={16} /> UI/UX
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="text-center py-10 text-slate-500">Memuat proyek...</div>
                ) : (
                    /* Grid Project */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedProject(item)}
                                    className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-xl transition cursor-pointer group"
                                >
                                    <div className="w-full aspect-[4/3] overflow-hidden relative bg-slate-200">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.shortDesc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.tech && item.tech.slice(0, 3).map((t, i) => (
                                                <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-10 text-slate-400">
                                Belum ada proyek di kategori ini.
                            </div>
                        )}
                    </div>
                )}

                {/* Modal */}
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </div>
        </section>
    );
}