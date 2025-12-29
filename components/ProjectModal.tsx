import React from 'react';
import { X, ExternalLink, Github } from 'lucide-react';

// Definisi tipe data yang fleksibel
export interface ProjectType {
    id: number;
    title: string;
    category: string; // String bebas (bukan lagi 'fullstack' | 'uiux')
    image: string;
    shortDesc: string;
    longDesc: string;
    tech: string[];
    link?: string | null;   // Opsional (boleh null/undefined)
    github?: string | null; // Opsional
}

interface ModalProps {
    project: ProjectType;
    onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ModalProps) {
    return (
        <div 
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Tombol Close */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-slate-100 rounded-full transition z-10 shadow-sm"
                >
                    <X size={20} className="text-slate-700" />
                </button>

                {/* Header Gambar */}
                <div className="w-full aspect-[16/9] bg-slate-100 relative">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Konten Modal */}
                <div className="p-6 md:p-8">
                    <div className="mb-6">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                            {project.category}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{project.title}</h2>
                    </div>

                    {/* Tech Stack Lengkap */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {project.tech.map((t, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                                {t}
                            </span>
                        ))}
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-600 mb-8 whitespace-pre-line">
                        {project.longDesc}
                    </div>

                    {/* Tombol Link (Hanya muncul jika datanya ada) */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                        {project.link && (
                            <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition hover:shadow-lg hover:shadow-blue-600/20"
                            >
                                <ExternalLink size={18} /> 
                                Kunjungi Website
                            </a>
                        )}
                        
                        {project.github && (
                            <a 
                                href={project.github} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition"
                            >
                                <Github size={19} /> 
                                Source Code
                            </a>
                        )}

                        {/* Jika tidak ada link sama sekali */}
                        {!project.link && !project.github && (
                            <p className="text-sm text-slate-400 italic">
                                Link demo atau source code tidak tersedia untuk publik saat ini.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}