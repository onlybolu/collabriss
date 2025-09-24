'use client';
import { motion } from 'framer-motion';
import InventoryIcon from '@/app/components/icons/InventoryIcon';
import PaymentsIcon from '@/app/components/icons/PaymentsIcon';
import StoreIcon from '@/app/components/icons/StoreIcon';

const features = [
    {
        icon: StoreIcon,
        title: 'Your Digital Storefront',
        description: 'Create a beautiful, professional-looking online store in minutes. Showcase your products and tell your brand story.'
    },
    {
        icon: InventoryIcon,
        title: 'Effortless Inventory',
        description: 'Track your stock levels in real-time across all your sales channels, from your website to social media.'
    },
    {
        icon: PaymentsIcon,
        title: 'Seamless Payments',
        description: 'Accept payments from customers anywhere in the world with our secure and reliable payment gateway integrations.'
    }
];

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.section id="features" className="py-20 px-4 bg-slate-50" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              A better way to run your business
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Collabriss gives you all the tools you need to start, manage, and grow your business from one simple platform.
            </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} className="p-8 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow" variants={itemVariants}>
                  <div className="bg-[#2EBF83]/10 text-[#2EBF83] rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-slate-800">{feature.title}</h4>
                  <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  );
}