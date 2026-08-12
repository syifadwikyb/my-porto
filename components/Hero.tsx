import React from 'react';
import { Github, Linkedin, Mail, Instagram } from 'lucide-react';

export default function Hero() {
    return (
        <section id="about" className="pt-32 pb-20 px-2 max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-medium text-blue-600">Halo, saya Syifa Dwiky Basamala</h2>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-slate-900">
                    Software Development &
                    <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        UI/UX Designer
                    </span>
                </h1>
                <p className="text-lg text-slate-600 text-justify px-4 lg:px-0 mt-4">
                    Fresh Graduate Teknik Komputer Universitas Diponegoro (IPK 3.69/4.0) dengan pengalaman sebagai Software Developer dan UI/UX Designer melalui startup, Bangkit Academy, serta berbagai proyek web dan mobile. Peraih Juara 2 UI/UX Competition Tingkat Nasional 2025. Memiliki keahlian dalam pengembangan aplikasi menggunakan Laravel, ReactJS, NextJS, ExpressJS, dan FastAPI, serta perancangan UI/UX menggunakan Figma dan Adobe Illustrator. Berpengalaman mengubah kebutuhan pengguna menjadi desain dan aplikasi fungsional.
                </p>

                {/* Social Media Links */}
                <div className="flex gap-4 justify-center md:justify-start pt-2">
                    <SocialIcon href="https://github.com/syifadwikyb" icon={<Github size={20} />} />
                    <SocialIcon href="https://linkedin.com/in/syifadwikyb" icon={<Linkedin size={20} />} />
                    <SocialIcon href="https://instagram.com/qy_creative" icon={<Instagram size={20} />} />
                </div>
            </div>

            <div className="flex-1 flex justify-center">
                <div className="w-64 h-64 md:w-72 md:h-72 lg:w-120 lg:h-120 rounded-full overflow-hidden border-4 border-white shadow-2xl relative">
                    <img src="Profile.jpg" alt="Profile" className="object-cover w-full h-full" />
                </div>
            </div>
        </section>
    );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer"
            className="p-3 bg-white border border-slate-200 rounded-full hover:bg-blue-50 hover:text-blue-600 transition shadow-sm">
            {icon}
        </a>
    );
}