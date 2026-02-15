import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { 
    CheckCircle2, 
    Users, 
    Zap, 
    Shield, 
    ArrowRight,
    Play,
    BarChart3,
    Clock,
    MessageSquare,
    Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: Zap,
            title: "Real-time Collaboration",
            description: "Work together seamlessly with live updates, instant notifications, and synchronized task boards.",
            color: "from-amber-500 to-orange-600"
        },
        {
            icon: Users,
            title: "Team Management",
            description: "Organize teams by departments, assign roles, and manage permissions with intuitive controls.",
            color: "from-indigo-500 to-purple-600"
        },
        {
            icon: BarChart3,
            title: "Progress Tracking",
            description: "Visualize project progress with analytics dashboards, completion rates, and performance insights.",
            color: "from-emerald-500 to-teal-600"
        },
        {
            icon: Shield,
            title: "Secure & Reliable",
            description: "Enterprise-grade security with role-based access control and encrypted data protection.",
            color: "from-rose-500 to-pink-600"
        },
        {
            icon: Clock,
            title: "Time Management",
            description: "Track deadlines, set priorities, and never miss a milestone with smart scheduling.",
            color: "from-cyan-500 to-blue-600"
        },
        {
            icon: MessageSquare,
            title: "Team Communication",
            description: "Built-in comments, mentions, and activity feeds to keep everyone on the same page.",
            color: "from-violet-500 to-fuchsia-600"
        }
    ];

    const stats = [
        { value: "10K+", label: "Active Users" },
        { value: "500K+", label: "Tasks Completed" },
        { value: "99.9%", label: "Uptime" },
        { value: "4.9/5", label: "User Rating" }
    ];

    return (
        <>
            <Head title="TaskFlow - Collaborative Project Management" />
            
            <div className="min-h-screen bg-[#0a0a0b] text-white overflow-hidden">
                {/* Animated Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/20 blur-3xl animate-pulse" />
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-amber-600/10 via-transparent to-rose-600/10 blur-3xl animate-pulse delay-1000" />
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                </div>

                {/* Navigation */}
                <motion.nav 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-50 border-b border-slate-800/50 backdrop-blur-xl bg-[#0a0a0b]/80"
                >
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <motion.div 
                                className="flex items-center gap-3"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50" />
                                    <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Layers className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                    TaskFlow
                                </span>
                            </motion.div>

                            {/* Nav Links */}
                            <div className="hidden md:flex items-center gap-8">
                                {['Features', 'Pricing', 'About', 'Contact'].map((item, i) => (
                                    <motion.a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        className="text-sm text-slate-400 hover:text-white transition-colors relative group"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                    >
                                        {item}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300" />
                                    </motion.a>
                                ))}
                            </div>

                            {/* Auth Buttons */}
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            href={route('dashboard')}
                                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/25"
                                        >
                                            Dashboard
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link
                                                href={route('login')}
                                                className="text-sm text-slate-400 hover:text-white transition-colors"
                                            >
                                                Log in
                                            </Link>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link
                                                href={route('register')}
                                                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/25"
                                            >
                                                Get Started
                                            </Link>
                                        </motion.div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.nav>

                {/* Hero Section */}
                <section className="relative z-10 pt-20 pb-32">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center max-w-4xl mx-auto">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm text-slate-300">Now with AI-powered insights</span>
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                            >
                                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                    Manage projects
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                                    with precision
                                </span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                            >
                                The all-in-one platform for teams to collaborate, track progress, 
                                and deliver projects on time. Real-time updates, intuitive workflows, 
                                and powerful analytics.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href={route('register')}
                                        className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-xl shadow-indigo-500/25"
                                    >
                                        Start Free Trial
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                                
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all border border-slate-700"
                                >
                                    <Play className="w-5 h-5" />
                                    Watch Demo
                                </motion.button>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
                            >
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + (i * 0.1) }}
                                        className="text-center"
                                    >
                                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section id="features" className="relative z-10 py-24 border-t border-slate-800/50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Everything you need to{' '}
                                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    ship faster
                                </span>
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Powerful features designed for modern teams who demand efficiency and clarity.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                    
                                    {/* Hover glow effect */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity blur-xl`} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative z-10 py-24">
                    <div className="max-w-5xl mx-auto px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-amber-600 p-1"
                        >
                            <div className="relative bg-[#0a0a0b] rounded-3xl p-12 md:p-16 text-center overflow-hidden">
                                {/* Background effects */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10" />
                                
                                <div className="relative z-10">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                        Ready to transform your{' '}
                                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                            workflow?
                                        </span>
                                    </h2>
                                    <p className="text-slate-400 mb-8 max-w-xl mx-auto text-lg">
                                        Join thousands of teams already using TaskFlow to deliver projects on time, every time.
                                    </p>
                                    
                                    <motion.div 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-block"
                                    >
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                                        >
                                            Get Started Free
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </motion.div>
                                    
                                    <p className="mt-4 text-sm text-slate-500">No credit card required • 14-day free trial</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 border-t border-slate-800/50 py-12 bg-[#0a0a0b]/50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Layers className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold text-white">TaskFlow</span>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-slate-500">
                                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms</a>
                                <a href="#" className="hover:text-white transition-colors">Support</a>
                            </div>
                            
                            <div className="text-sm text-slate-600">
                                Laravel v{laravelVersion} • PHP v{phpVersion}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}