import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Layers } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-[#0a0a0b] relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-amber-600/5 via-transparent to-rose-600/5 blur-3xl animate-pulse delay-1000" />
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <Link 
                        href="/" 
                        className="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                            <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                                <Layers className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            TaskFlow
                        </span>
                    </Link>
                </div>

                {/* Card Container - WITH PROPER STYLING */}
                <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-30 group-hover:opacity-50 transition duration-500 blur" />
                    
                    {/* Card - NOW WITH VISIBLE BACKGROUND */}
                    <div className="relative p-8 bg-[#111113] rounded-2xl border border-slate-800 shadow-2xl">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-slate-600">
                    © {new Date().getFullYear()} TaskFlow. All rights reserved.
                </p>
            </div>
        </div>
    );
}