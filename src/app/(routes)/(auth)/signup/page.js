'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import NextImage from 'next/image';
import GoogleIcon from '@/app/components/icons/GoogleIcon';
import { useRouter } from 'next/navigation';
import {
  account,
  databases,
  ID,
  DATABASE_ID,
  PROFILES_COLLECTION_ID,
} from '@/app/lib/appwrite';

const stepVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction > 0 ? '100%' : '-100%',
  }),
  visible: {
    opacity: 1,
    x: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction < 0 ? '100%' : '-100%',
  }),
};

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const handleNext = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || isGoogleLoading) return;
    setIsLoading(true);
    try {
      const newUser = await account.create(
        ID.unique(),
        formData.email,
        formData.password,
        `${formData.firstName} ${formData.lastName}`
      );
      await account.createEmailPasswordSession(formData.email, formData.password);

      // Pass user info to the setup page to create the profile there
      const query = new URLSearchParams({
        businessName: formData.businessName,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }).toString();
      router.push(`/welcome/setup?${query}`);
    } catch (error) {
      console.error('Failed to create user:', error);
      setError(error.message || 'Could not create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (isLoading || isGoogleLoading) return;
    setIsGoogleLoading(true);
    account.createOAuth2Session(
      'google',
      `${window.location.origin}/welcome/setup`, // Success URL
      `${window.location.origin}/signup` // Failure URL
    );
  };


  return (
    <div className="flex items-stretch min-h-screen bg-white">
      {/* Image Section */}
      <div className="w-1/2 hidden md:block relative">
        <div className="absolute inset-0 bg-black opacity-50 z-10" />
        <Link href="/" className="absolute top-8 left-8 z-20" aria-label="Go to homepage">
          <NextImage
            src="/logo.png"
            alt="Collabriss Logo"
            width={160}
            height={40}
            className="h-40 w-auto invert brightness-0"
            priority
          />
        </Link>
        <NextImage src="/auth_bg.jpg" alt="Signup Background" layout="fill" objectFit="cover" />
      </div>
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8">
        <Link href="/" className="md:hidden mb-8" aria-label="Go to homepage">
          <NextImage src="/logo.png" alt="Collabriss Logo" width={1000} height={35} className="h-40 w-auto" priority />
        </Link>
        <div className="w-full max-w-md">
          <AnimatePresence initial={false} custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">What is your business name?</h1>
                <p className="text-slate-500 text-center mb-8">This will be the name of your Collabriss store.</p>
                <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                      <input type="text" id="businessName" name="businessName" required value={formData.businessName} onChange={handleChange} className="w-full px-4 py-3 border outline-0 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" />
                    </div> 
                    <button type="submit" className="w-full bg-[#2EBF83] text-white font-bold py-3 rounded-lg text-lg hover:bg-green-600 transition-colors mt-2">Next</button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Create your account</h1>
                <button onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading} className="w-full py-3 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:cursor-not-allowed">
                  {isGoogleLoading ? (
                    <svg className="animate-spin h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : <GoogleIcon />}
                  <span className="text-slate-700 font-medium">
                    {isGoogleLoading ? 'Redirecting...' : 'Sign up with Google'}
                  </span>
                </button>
                <div className="flex items-center my-6">
                  <hr className="flex-grow border-t border-slate-300" />
                  <span className="mx-4 text-sm font-medium text-slate-500">OR</span>
                  <hr className="flex-grow border-t border-slate-300" />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <p className="text-red-500 text-sm text-center -mb-2">{error}</p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 border outline-0 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 border outline-0 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border outline-0 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" id="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 outline-0 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={handleBack} disabled={isLoading || isGoogleLoading} className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-lg text-lg hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
                    <button type="submit" disabled={isLoading || isGoogleLoading} className="w-full bg-[#2EBF83] text-white font-bold py-3 rounded-lg text-lg hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center">
                      {isLoading && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {isLoading ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-8 text-sm text-slate-600 text-center w-full max-w-md">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#2EBF83] hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}