'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#2EBF83]"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const pricingPlans = {
  monthly: [
    {
      name: 'Free',
      price: '₦0',
      period: '/month',
      description: 'For individuals and hobbyists getting started.',
      features: [
        '25 Products',
        'Online Store',
        'Basic Inventory Management',
        'Community Support',
      ],
      buttonText: 'Start for Free',
      popular: false,
    },
    {
      name: 'Starter',
      price: '₦4,500',
      period: '/month',
      description: 'For small businesses ready to grow.',
      features: [
        'Unlimited Products',
        'Advanced Inventory',
        'Staff Accounts',
        'Custom Domain',
        'Priority Support',
      ],
      buttonText: 'Choose Starter',
      popular: true,
    },
    {
      name: 'Pro',
      price: '₦15,000',
      period: '/month',
      description: 'For established businesses that need more power.',
      features: [
        'Everything in Starter',
        'Advanced Analytics',
        'API Access',
        'Dedicated Account Manager',
      ],
      buttonText: 'Choose Pro',
      popular: false,
    },
  ],
  yearly: [
    {
      name: 'Free',
      price: '₦0',
      period: '/year',
      description: 'For individuals and hobbyists getting started.',
      features: [
        '25 Products',
        'Online Store',
        'Basic Inventory Management',
        'Community Support',
      ],
      buttonText: 'Start for Free',
      popular: false,
    },
    {
      name: 'Starter',
      price: '₦45,000',
      period: '/year',
      description: 'For small businesses ready to grow.',
      features: [
        'Unlimited Products',
        'Advanced Inventory',
        'Staff Accounts',
        'Custom Domain',
        'Priority Support',
      ],
      buttonText: 'Choose Starter',
      popular: true,
    },
    {
      name: 'Pro',
      price: '₦150,000',
      period: '/year',
      description: 'For established businesses that need more power.',
      features: [
        'Everything in Starter',
        'Advanced Analytics',
        'API Access',
        'Dedicated Account Manager',
      ],
      buttonText: 'Choose Pro',
      popular: false,
    },
  ],
};

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = pricingPlans[billingCycle];

  return (
    <motion.section
      id="pricing"
      className="py-20 bg-slate-50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold lg:text-4xl text-slate-900">Choose Your Plan</h2>
          <p className="mt-4 text-slate-600">
            Start for free, then grow with us. Simple, transparent pricing.
          </p>
        </div>

        <div className="flex justify-center items-center space-x-4 mb-10">
          <span className="text-slate-600">Monthly</span>
          <label htmlFor="billing-toggle" className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="billing-toggle"
              className="sr-only peer"
              checked={billingCycle === 'yearly'}
              onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2EBF83]"></div>
          </label>
          <span className="flex items-center text-slate-600">
            Yearly
            <span className="ml-2 text-xs font-semibold text-[#2EBF83] bg-green-100 px-2 py-0.5 rounded-full">SAVE 15%</span>
          </span>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg p-6 flex flex-col ${plan.popular ? 'border-[#2EBF83] border-2 relative' : 'border border-slate-200'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-sm font-semibold text-white bg-[#2EBF83] rounded-full">Most Popular</span>
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
              <p className="mt-2 text-slate-500">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-slate-500">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-3">
                    <CheckIcon />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-[#2EBF83] text-white hover:bg-green-600'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}