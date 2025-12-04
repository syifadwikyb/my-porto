import React from 'react';
import { X, ExternalLink, Github } from 'lucide-react';

// Definisikan tipe data proyek
export interface ProjectType {
    id: number;
    title: string;
    category: 'fullstack' | 'uiux';
    image: string;
    shortDesc: string;
    longDesc: string; // Deskripsi detail untuk modal
    tech: string[];
    link?: string;
    github?: string;
}

interface ModalProps {
    project: ProjectType;
    onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ModalProps) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition z-10">
                    <X size={20} />
                </button>

                {/* Image Header */}
                <div className="w-full aspect-[4/3] bg-slate-100 relative">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-8">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${project.category === 'fullstack' ? 'text-blue-600' : 'text-purple-600'}`}>
                                {project.category === 'fullstack' ? 'Development' : 'UI/UX Design'}
                            </span>
                            <h2 className="text-2xl font-bold text-slate-900 mt-1">{project.title}</h2>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((t, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                {t}
                            </span>
                        ))}
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-8">
                        {project.longDesc}
                    </p>

                    <div className="flex gap-4">
                        {project.link && (
                            <a href={project.link} target="_blank" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                                <ExternalLink size={18} /> Live Demo
                            </a>
                        )}
                        {project.github && (
                            <a href={project.github} target="_blank" className="flex items-center gap-2 border border-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition">
                                <Github size={18} /> Source Code
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}