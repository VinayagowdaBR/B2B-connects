
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle2, Users, Target, Rocket, Award, Lightbulb, Heart, ArrowRight } from 'lucide-react';

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
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium select-none">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!content) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-violet-200 selection:text-violet-900">
            <Navbar />

            {/* Backgound Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-violet-100/50 to-transparent" />
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/20 blur-3xl" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/20 blur-3xl" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-48 pb-24 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold mb-8">
                                <Users className="w-4 h-4" />
                                <span>Who We Are</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                                Empowering <br />
                                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Global Trade</span>
                            </h1>

                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                                {content.description || "Connecting businesses, fostering innovation, and building the future of B2B commerce."}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-violet-200 hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2">
                                    <Rocket className="w-5 h-5" />
                                    Get Started
                                </button>
                                <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2">
                                    Contact Us
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Image / Visuals */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-violet-200">
                                <img
                                    src={content.hero_image_url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"}
                                    alt="About Hero"
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 to-transparent" />

                                {/* Floating Stats */}
                                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-slate-900">10K+</div>
                                            <div className="text-sm text-slate-500">Active Companies</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background Elements behind image */}
                            <div className="absolute top-[-20px] right-[-20px] w-full h-full border-2 border-violet-200 rounded-[2.5rem] -z-10" />
                            <div className="absolute bottom-[-40px] left-[-40px] w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-20" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Driven by Purpose</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Our guiding principles that shape every decision we make.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Mission */}
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-violet-100 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mb-6 text-violet-600 group-hover:scale-110 transition-transform">
                                <Target className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Our Mission</h3>
                            <p className="text-slate-600 leading-relaxed">{content.mission}</p>
                        </div>

                        {/* Vision */}
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-violet-100 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-fuchsia-100 flex items-center justify-center mb-6 text-fuchsia-600 group-hover:scale-110 transition-transform">
                                <Lightbulb className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Our Vision</h3>
                            <p className="text-slate-600 leading-relaxed">{content.vision}</p>
                        </div>

                        {/* Core Values */}
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-violet-100 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                                <Heart className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Core Values</h3>
                            <ul className="space-y-3">
                                {(content.values || []).map((value, index) => (
                                    <li key={index} className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                        <span>{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative">
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 blur-[100px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[100px] rounded-full" />

                        <div className="grid lg:grid-cols-2 items-center gap-12 p-8 lg:p-16 relative z-10">
                            <div className="order-2 lg:order-1">
                                <img
                                    src={content.team_image_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"}
                                    alt="Team"
                                    className="rounded-3xl shadow-2xl border border-white/10"
                                />
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="flex items-center gap-2 mb-6">
                                    <Award className="w-6 h-6 text-yellow-500" />
                                    <span className="text-yellow-500 font-bold uppercase tracking-wider text-sm">World Class Team</span>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-6">Meet the Minds Behind the Magic</h2>
                                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                    We are a group of passionate individuals committed to revolutionizing the B2B landscape. Together, we build tools that empower businesses to grow without limits.
                                </p>
                                <button className="text-white font-semibold flex items-center gap-2 group hover:text-violet-300 transition-colors">
                                    Join Our Team
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
