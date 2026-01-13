
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Shield, FileText, Lock, Scale } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white selection:bg-indigo-500/30">
            <Navbar />

            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent" />
                <div className="absolute bottom-[-10%] right-[-10%] orb orb-2 opacity-30" />
            </div>

            <section className="relative pt-40 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                <Scale className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Terms of Service
                            </h1>
                            <p className="text-xl text-gray-400">
                                Last updated: January 13, 2026
                            </p>
                        </motion.div>
                    </div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 space-y-12"
                    >
                        {/* Section 1 */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10">
                                    <FileText className="w-5 h-5 text-indigo-400" />
                                </div>
                                1. Agreement to Terms
                            </h2>
                            <p className="text-gray-400 leading-relaxed pl-12">
                                By accessing our website, you agree to be bound by these Terms of Service and to verify specifically these details. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <Shield className="w-5 h-5 text-purple-400" />
                                </div>
                                2. Use License
                            </h2>
                            <p className="text-gray-400 leading-relaxed pl-12">
                                Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc leading-relaxed pl-16 text-gray-400 space-y-2">
                                <li>Modify or copy the materials;</li>
                                <li>Use the materials for any commercial purpose, or for any public display;</li>
                                <li>Attempt to decompile or reverse engineer any software contained on our website;</li>
                                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-pink-500/10">
                                    <Lock className="w-5 h-5 text-pink-400" />
                                </div>
                                3. Disclaimer
                            </h2>
                            <p className="text-gray-400 leading-relaxed pl-12">
                                The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10">
                                    <Scale className="w-5 h-5 text-emerald-400" />
                                </div>
                                4. Limitations
                            </h2>
                            <p className="text-gray-400 leading-relaxed pl-12">
                                In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsPage;
