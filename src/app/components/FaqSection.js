'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

const faqData = [
  {
    question: 'What is Collabriss?',
    answer:
      'Collabriss is an all-in-one commerce app that helps small business owners manage their business from their smartphone. You can create an online store, manage inventory, track sales, and engage with customers without needing any coding skills.',
  },
  {
    question: 'Who is this app for?',
    answer:
      'Collabriss is designed for entrepreneurs, small business owners, social media sellers, and anyone looking to start an online business with minimal hassle. If you sell products online, in-person, or on social media, Collabriss is for you.',
  },
  {
    question: 'Can I use my own domain name?',
    answer:
      'Yes! On our paid plans, you can connect your own custom domain name to your Collabriss store to create a professional, branded online presence.',
  },
  {
    question: 'How do I receive payments?',
    answer:
      'We integrate with major, secure payment gateways that allow you to accept payments via credit/debit cards, bank transfers, and USSD. Your money is sent directly to your bank account.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We take data security very seriously. All your business data is encrypted and stored securely. We use industry-standard security protocols to protect your information.',
  },
];

const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-200 py-4">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={onClick}
      >
        <h4 className="text-lg font-medium text-slate-800">{question}</h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-slate-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-slate-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FaqSection() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggle = (question) => {
    setActiveQuestion(activeQuestion === question ? null : question);
  };

  const filteredFaqData = useMemo(() => {
    if (!searchTerm) {
      return faqData;
    }
    return faqData.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <motion.section
      id="faq"
      className="py-20 px-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}>
      <div className="container mx-auto max-w-3xl">
        <h3 className="text-3xl font-bold text-center mb-4 text-slate-900">Frequently Asked Questions</h3>
        <p className="text-slate-600 text-center mb-12">
          Have questions? We have answers. If you can&apos;t find what you&apos;re looking for, feel free to contact us.
        </p>
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors"
          />
        </div>
        <div className="space-y-2">
          {filteredFaqData.length > 0 ? (
            filteredFaqData.map((faq) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={activeQuestion === faq.question}
                onClick={() => handleToggle(faq.question)}
              />
            ))
          ) : (
            <p className="text-center text-slate-500">No questions found.</p>
          )}
        </div>
      </div>
    </motion.section>
  );
}