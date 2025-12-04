"use client";
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Experience() {
    const [experiences, setExperiences] = useState<any[]>([]);

    useEffect(() => {
        async function fetchExperience() {
            const { data } = await supabase.from('experience').select('*').order('id', { ascending: false });
            if (data) setExperiences(data);
        }
        fetchExperience();
    }, []);

    return (
        <section id="experience" className="py-20 bg-white px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 inline-block relative">
                        Pengalaman Kerja
                        <span className="block h-1 w-1/2 bg-blue-600 mt-2 mx-auto rounded-full"></span>
                    </h2>
                </div>

                {/* Timeline */}
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">

                    {experiences.map((exp) => (
                        <div key={exp.id} className="relative flex items-start group">
                            {/* Dot Mobile */}
                            <div className="absolute left-0 ml-5 -translate-x-1/2 md:hidden">
                                <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm"></div>
                            </div>

                            <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-8 pl-12 sm:pl-0">
                                {/* Kiri (Waktu) */}
                                <div className="hidden sm:flex sm:w-1/3 flex-col items-end text-right pt-1">
                                    <span className="text-lg font-bold text-slate-900">{exp.company}</span>
                                    <span className="flex items-center gap-1 text-sm text-blue-600 font-medium mt-1">
                                        <Calendar size={14} /> {exp.period}
                                    </span>
                                </div>

                                {/* Tengah (Dot Desktop) */}
                                <div className="hidden sm:flex flex-col items-center">
                                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm z-10"></div>
                                    <div className="h-full w-0.5 bg-slate-200 -mt-2"></div>
                                </div>

                                {/* Kanan (Konten) */}
                                <div className="sm:w-2/3">
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">

                                        {/* Header Mobile */}
                                        <div className="sm:hidden mb-2">
                                            <h3 className="font-bold text-slate-900 text-lg">{exp.company}</h3>
                                            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded inline-block mt-1">
                                                {exp.period}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-slate-800">{exp.role}</h3>
                                            <span className="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-600 rounded hidden sm:inline-block">
                                                {exp.type}
                                            </span>
                                        </div>

                                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}