
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle2, Users, Target, Rocket, Award, Lightbulb, Heart } from 'lucide-react';

const AboutPage = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/public/about`);
                const data = await response.json();
                setContent(data);
            } catch (err) {
                console.error("Failed to fetch about content", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                    {/* Background Orbs */}
                    <div className="absolute top-1/4 left-1/4 orb orb-1" />
                    <div className="absolute bottom-1/4 right-1/4 orb orb-2" />
                    <div className="glass p-8 rounded-2xl flex flex-col items-center gap-4 relative z-10">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white font-medium">Loading amazing things...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!content) return null;

    return (
        <div className="min-h-screen bg-slate-900 text-white selection:bg-indigo-500/30">
            <Navbar />

            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] orb orb-1 opacity-40" />
                <div className="absolute bottom-[-10%] right-[-10%] orb orb-2 opacity-40" />
                <div className="absolute top-[40%] right-[20%] orb orb-3 opacity-30" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <div className="inline-block px-4 py-2 rounded-full glass mb-6 border border-indigo-500/30">
                                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold tracking-wider text-sm uppercase">
                                    Our Story
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    {content.title}
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                                {content.description}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="btn-premium px-8 py-4 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 flex items-center gap-2">
                                    <Rocket className="w-5 h-5" />
                                    Get Started
                                </button>
                                <button className="px-8 py-4 glass rounded-xl font-bold hover:bg-white/10 transition-colors border border-white/20 flex items-center gap-2">
                                    Contact Us
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse-glow" />
                            <div className="relative rounded-3xl overflow-hidden glass-card p-2 transform hover:scale-[1.02] transition-transform duration-500">
                                <img
                                    src={content.hero_image_url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"}
                                    alt="About Us"
                                    className="w-full h-full object-cover rounded-2xl"
                                />

                                {/* Floating Stats Card */}
                                <div className="absolute -bottom-10 -left-10 md:bottom-10 md:-left-10 glass-card p-6 rounded-2xl animate-float lg:block hidden">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                                            <Users className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-white">10K+</div>
                                            <div className="text-sm text-gray-400">Active Users</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Cards */}
            <section className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 rounded-3xl group hover:bg-white/5 transition-colors"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                <Target className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {content.mission}
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-8 rounded-3xl group hover:bg-white/5 transition-colors"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                                <Lightbulb className="w-7 h-7 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {content.vision}
                            </p>
                        </motion.div>

                        {/* Core Values */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-8 rounded-3xl group hover:bg-white/5 transition-colors"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-colors">
                                <Heart className="w-7 h-7 text-pink-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Core Values</h3>
                            <ul className="space-y-4">
                                {(content.values || []).map((value, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                                        <span>{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden">
                        {/* Decorative Gradients */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-indigo-900/40 to-transparent pointer-events-none" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                            <div className="order-2 lg:order-1">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                                    <img
                                        src={content.team_image_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"}
                                        alt="Our Team"
                                        className="relative rounded-2xl shadow-2xl w-full border border-white/10"
                                    />
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <Award className="w-6 h-6 text-yellow-400" />
                                    <span className="text-yellow-400 font-semibold tracking-wide uppercase text-sm">World Class Team</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built by dreamers & doers</h2>
                                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                                    We are a diverse group of thinkers, makers, and dreamers. We believe in the power of technology to bridge gaps and create opportunities for businesses worldwide.
                                </p>
                                <button className="text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-2 group transition-colors">
                                    Join our journey
                                    <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;
