"use client";
import React, { useState, useRef } from 'react';
import { Mail, Github, Linkedin, Instagram, Send, Loader2, CheckCircle2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Footer() {
    const form = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // GANTI 3 LOGO INI DENGAN ID DARI AKUN EMAILJS ANDA
        const SERVICE_ID = 'service_cxzvuvf';
        const TEMPLATE_ID = 'template_ncgeojl';
        const PUBLIC_KEY = 'aOjlqsGT9DGYN9rgD';

        if (form.current) {
            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
                .then((result) => {
                    setLoading(false);
                    setStatus('success');
                    // Reset form setelah 3 detik
                    setTimeout(() => {
                        setStatus('idle');
                        form.current?.reset();
                    }, 3000);
                }, (error) => {
                    setLoading(false);
                    setStatus('error');
                    console.error(error.text);
                });
        }
    };

    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">

                {/* Kolom Kiri: Branding & Social */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent inline-block mb-2">
                            Syifa Dwiky Basamala
                        </h2>
                        <p className="text-slate-400 leading-relaxed max-w-sm">
                            Fullstack Developer | UI/UX Designer
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <SocialLink href="https://github.com/syifadwikyb" icon={<Github size={20} />} />
                        <SocialLink href="https://linkedin.com/in/syifadwiky" icon={<Linkedin size={20} />} />
                        <SocialLink href="https://instagram.com/dwikyb_" icon={<Instagram size={20} />} />
                        <SocialLink href="mailto:syifadwikyb@gmail.com" icon={<Mail size={20} />} />
                    </div>                    
                </div>

                {/* Kolom Kanan: Form Kontak */}
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold mb-6">Kirim Saya Pesan 🚀</h3>                

                    <form ref={form} onSubmit={sendEmail} className="space-y-4">
                        {/* Input Nama */}
                        <div>
                            <input
                                type="text"
                                name="from_name" // Harus sesuai variable di template EmailJS
                                placeholder="Nama Anda"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-slate-200 placeholder:text-slate-500"
                            />
                        </div>

                        {/* Input Email */}
                        <div>
                            <input
                                type="email"
                                name="from_email" // Harus sesuai variable di template EmailJS
                                placeholder="Email Anda"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-slate-200 placeholder:text-slate-500"
                            />
                        </div>

                        {/* Input Pesan */}
                        <div>
                            <textarea
                                name="message" // Harus sesuai variable di template EmailJS
                                placeholder="Tulis pesan Anda di sini..."
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-slate-200 placeholder:text-slate-500 resize-none"
                            ></textarea>
                        </div>

                        {/* Tombol Kirim */}
                        <button
                            type="submit"
                            disabled={loading || status === 'success'}
                            className={`w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 ${status === 'success'
                                    ? 'bg-green-600 text-white cursor-default'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-600/20'
                                }`}
                        >
                            {loading ? (
                                <><Loader2 size={20} className="animate-spin" /> Mengirim...</>
                            ) : status === 'success' ? (
                                <><CheckCircle2 size={20} /> Terkirim!</>
                            ) : (
                                <><Send size={18} /> Kirim Pesan</>
                            )}
                        </button>

                        {status === 'error' && (
                            <p className="text-red-400 text-xs text-center mt-2">Gagal mengirim. Silakan coba lagi nanti.</p>
                        )}
                    </form>
                </div>
            </div>

            <div className="text-center border-t border-slate-800 pt-8 text-slate-500 text-sm">
                <p>© {new Date().getFullYear()} Syifa Dwiky Basamala</p>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
        >
            {icon}
        </a>
    );
}