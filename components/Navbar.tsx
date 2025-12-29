"use client";
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between h-16 items-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Dwikyb
                    </span>

                    {/* Desktop */}
                    <div className="hidden md:flex space-x-8 font-medium text-slate-600">
                        <a href="#about" className="hover:text-blue-600 transition">Tentang</a>
                        <a href="#experience" className="hover:text-blue-600 transition">Pengalaman</a>
                        <a href="#projects" className="hover:text-blue-600 transition">Proyek</a>
                    </div>

                    {/* Mobile Button */}
                    <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
                    <a href="#about" className="block" onClick={() => setIsOpen(false)}>Tentang</a>
                    <a href="#experience" className="block" onClick={() => setIsOpen(false)}>Pengalaman</a>
                    <a href="#projects" className="block" onClick={() => setIsOpen(false)}>Proyek</a>
                </div>
            )}
        </nav>
    );
}