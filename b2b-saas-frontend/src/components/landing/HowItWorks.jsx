import { useState } from 'react';
import { UserPlus, Search, MessageCircle, HandshakeIcon, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const HowItWorks = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const steps = [
    {
      icon: UserPlus,
      title: 'Sign Up Free',
      description: 'Create your account in minutes and get instant access to thousands of verified suppliers.',
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.1,
    },
    {
      icon: Search,
      title: 'Search Products',
      description: 'Browse through our extensive catalog and find exactly what your business needs.',
      gradient: 'from-purple-500 to-violet-500',
      delay: 0.2,
    },
    {
      icon: MessageCircle,
      title: 'Connect & Negotiate',
      description: 'Send inquiries directly to suppliers and negotiate the best deals for your business.',
      gradient: 'from-orange-500 to-amber-500',
      delay: 0.3,
    },
    {
      icon: HandshakeIcon,
      title: 'Close Deals',
      description: 'Finalize agreements with verified suppliers and grow your business with confidence.',
      gradient: 'from-green-500 to-emerald-500',
      delay: 0.4,
    },
  ];

  return (
    <section ref={ref} className="relative py-24 bg-gradient-to-b from-white via-indigo-50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6">
            <CheckCircle className="w-4 h-4 text-indigo-600" />
            <span className="text-indigo-600 text-sm font-semibold">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start connecting with verified suppliers in just four simple steps
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Lines - Desktop Only */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

          {steps.map((step, index) => {
            const IconComponent = step.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: step.delay }}
                className="relative"
              >
                {/* Step Card */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  {/* Step Number Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: step.delay + 0.2, type: 'spring' }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  >
                    {index + 1}
                  </motion.div>

                  {/* Icon with Gradient Background */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="relative mb-6"
                  >
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-2xl blur-xl opacity-50`} />
                    
                    {/* Icon container */}
                    <div className={`relative inline-flex p-5 bg-gradient-to-br ${step.gradient} rounded-2xl shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow indicator for mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-6">
                      <ArrowRight className="w-6 h-6 text-indigo-300" />
                    </div>
                  )}
                </motion.div>

                {/* Connecting Arrow - Desktop Only */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: step.delay + 0.3 }}
                    className="hidden lg:block absolute top-20 -right-4 z-10"
                  >
                    <div className="w-8 h-8 bg-white border-2 border-indigo-300 rounded-full flex items-center justify-center shadow-md">
                      <ArrowRight className="w-4 h-4 text-indigo-600" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
