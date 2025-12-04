import React from 'react';

interface AdminTabsProps {
    activeTab: 'project' | 'experience';
    setActiveTab: (tab: 'project' | 'experience') => void;
    onTabChange: () => void; // Untuk reset form saat ganti tab
}

export default function AdminTabs({ activeTab, setActiveTab, onTabChange }: AdminTabsProps) {
    return (
        <div className="flex gap-4 mb-8">
            <button
                onClick={() => { setActiveTab('project'); onTabChange(); }}
                className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'project' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
                Manage Projects
            </button>
            <button
                onClick={() => { setActiveTab('experience'); onTabChange(); }}
                className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'experience' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
                Manage Experience
            </button>
        </div>
    );
}