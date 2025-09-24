'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const FeatureDetail = ({ title, description, imageSrc, imageSide = 'left' }) => {
  const imageOrder = imageSide === 'left' ? 'md:order-1' : 'md:order-2';
  const textOrder = imageSide === 'left' ? 'md:order-2' : 'md:order-1';

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center py-16">
      <motion.div
        className={imageOrder}
        initial={{ opacity: 0, x: imageSide === 'left' ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-slate-100 rounded-lg aspect-square overflow-hidden shadow-lg">
          <Image
            src={imageSrc}
            alt={title}
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
      <motion.div
        className={textOrder}
        initial={{ opacity: 0, x: imageSide === 'left' ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h3 className="text-3xl font-bold text-slate-900 mb-4">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </motion.div>
    </div>
  );
};

export default function DetailedFeatures() {
  return (
    <section id="detailed-features" className="py-20 px-4 container mx-auto">
      <div className="space-y-16">
        <FeatureDetail
          title="Sell everywhere, from one place."
          description="Launch a beautiful, mobile-friendly online store in minutes. But don't stop there. Easily sync your products to sell on Instagram, Facebook, and WhatsApp, all managed from your Collabriss dashboard."
          imageSide="left"
          imageSrc="/sell.png"
        />
        <FeatureDetail
          title="Manage your business on the go."
          description="Your business doesn't stop when you're away from your desk. With our powerful mobile app, you can manage orders, update inventory, view sales analytics, and communicate with customers, anytime, anywhere."
          imageSide="right"
          imageSrc="/manage-business.png"
        />
        <FeatureDetail
          title="Get paid quickly and securely."
          description="Accept payments from anyone, anywhere. We integrate with major payment gateways to offer your customers a seamless and secure checkout experience with options like card payments, bank transfers, and USSD."
          imageSide="left"
          imageSrc="/secure-payment.png"
        />
      </div>
    </section>
  );
}