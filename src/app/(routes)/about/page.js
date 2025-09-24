'use client';

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { motion } from 'framer-motion';
import FacebookIcon from "@/app/components/icons/FacebookIcon";
import LinkedInIcon from "@/app/components/icons/LinkedInIcon";
import TwitterIcon from "@/app/components/icons/TwitterIcon";

export default function ContactPage() {
  return (
    <div className="bg-slate-50">
      <Header />
      <main className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Get in Touch</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We&apos;d love to hear from you! Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 bg-white p-8 md:p-12 rounded-2xl shadow-lg">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h2>
              <div className="space-y-4 text-slate-600">
                <p><strong>Email:</strong> <a href="mailto:support@collabriss.com" className="text-[#2EBF83] hover:underline">support@collabriss.com</a></p>
                <p><strong>Address:</strong> 123 Commerce St, Business City, 10101</p>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" aria-label="Twitter" className="text-slate-500 hover:text-[#2EBF83]"><TwitterIcon className="w-6 h-6" /></a>
                  <a href="#" aria-label="Facebook" className="text-slate-500 hover:text-[#2EBF83]"><FacebookIcon className="w-6 h-6" /></a>
                  <a href="#" aria-label="LinkedIn" className="text-slate-500 hover:text-[#2EBF83]"><LinkedInIcon className="w-6 h-6" /></a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" id="name" name="name" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" id="email" name="email" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea id="message" name="message" rows="4" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent"></textarea>
                </div>
                <div>
                  <button type="submit" className="w-full bg-[#2EBF83] text-white font-bold py-3 rounded-lg text-lg hover:bg-green-600 transition-colors">
                    Send Message
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}