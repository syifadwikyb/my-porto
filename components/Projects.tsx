"use client";
import React, { useState, useEffect } from 'react';
import ProjectModal, { ProjectType } from './ProjectModal';
import { supabase } from '@/lib/supabase'; 

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            setIsLoading(true);
            
            // Ambil SEMUA data, urutkan dari yang terbaru (id descending)
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('id', { ascending: false });

            if (error) {
                console.error("Error fetching projects:", error.message);
            }

            if (data) {
                const formattedData: ProjectType[] = data.map((item: any) => {
                    // Logika membersihkan format Tech Stack (array vs string)
                    let techArray: string[] = [];
                    if (Array.isArray(item.tech_stack)) {
                        techArray = item.tech_stack;
                    } else if (typeof item.tech_stack === 'string') {
                        techArray = item.tech_stack.split(',').map((t: string) => t.trim().replace(/['"]+/g, ''));
                    }

                    return {
                        id: item.id,
                        title: item.title,
                        category: item.category, // Menerima text bebas dari input admin
                        image: item.image_url || "/api/placeholder/600/400",
                        shortDesc: item.short_desc,
                        longDesc: item.long_desc,
                        tech: techArray.filter(t => t.length > 0), // Hapus string kosong
                        link: item.demo_link || null, // Jika kosong jadi null
                        github: item.repo_link || null
                    };
                });
                setProjects(formattedData);
            }
            setIsLoading(false);
        }

        fetchProjects();
    }, []);

    return (
        <section id="projects" className="py-24 bg-slate-50 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Proyek Saya</h2>

                {isLoading ? (
                    <div className="text-center py-12 text-slate-500">Memuat data proyek...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.length > 0 ? (
                            projects.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedProject(item)}
                                    className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                                >
                                    {/* Gambar dengan rasio tetap 4:3 */}
                                    <div className="w-full aspect-[4/3] overflow-hidden relative bg-slate-200">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        {/* Badge Kategori Melayang */}
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm uppercase tracking-wide">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h3>
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">{item.shortDesc}</p>
                                        
                                        {/* Tags Tech Stack (Max 3) */}
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {item.tech && item.tech.slice(0, 3).map((t, i) => (
                                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                                                    {t}
                                                </span>
                                            ))}
                                            {item.tech.length > 3 && (
                                                <span className="text-xs text-slate-400 px-1 py-1">+{item.tech.length - 3}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
                                Belum ada proyek yang ditambahkan.
                            </div>
                        )}
                    </div>
                )}

                {/* Tampilkan Modal jika ada project yang dipilih */}
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