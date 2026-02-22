import React from 'react';
import { Github, Linkedin, Mail, Instagram } from 'lucide-react';

export default function Hero() {
    return (
        <section id="about" className="pt-32 pb-20 px-4 max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left space-y-6">
                <h2 className="text-xl font-medium text-blue-600">Halo, saya Syifa Dwiky Basamala 👋</h2>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
                    Fullstack Developer & <br /> UI/UX Designer
                </h1>
                <p className="text-lg text-slate-600">
                    Menciptakan solusi digital yang tidak hanya berfungsi dengan baik, tapi juga terlihat menawan.
                </p>

                {/* Social Media Links */}
                <div className="flex gap-4 justify-center md:justify-start pt-4">
                    <SocialIcon href="https://github.com/syifadwikyb" icon={<Github size={20} />} />
                    <SocialIcon href="https://linkedin.com/in/syifadwikyb" icon={<Linkedin size={20} />} />
                    <SocialIcon href="https://instagram.com/dwikyb_" icon={<Instagram size={20} />} />
                </div>
            </div>

            <div className="flex-1 flex justify-center">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl relative">
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