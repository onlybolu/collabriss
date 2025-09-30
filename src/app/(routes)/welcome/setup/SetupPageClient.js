'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import NextImage from 'next/image';
import { AppwriteException } from 'appwrite';
import {
  account,
  functions,
  databases,
  DATABASE_ID,
  PROFILES_COLLECTION_ID,
} from '@/app/lib/appwrite';
import Loader from '@/app/components/Loader';

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const productCategories = ["Fashion & Apparel", "Electronics", "Food & Drinks", "Health & Beauty", "Home & Garden", "Services", "Other"];
const sellingChannels = ["Instagram", "Facebook", "WhatsApp", "Physical Store", "Another website", "I'm just starting"];

export default function WelcomeSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    businessName: '',
    firstName: '',
    lastName: '',
    category: '',
    channels: [],
    phone: ''
  });
  const [referralCode, setReferralCode] = useState('');
  const [referralStatus, setReferralStatus] = useState({ status: 'idle', message: '', details: null }); // idle, validating, valid, invalid
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState('loading'); // 'loading', 'authenticated', 'unauthenticated'
  const controls = useAnimation();

  useEffect(() => {
    // Pre-fill form data from URL for email/password signups
    setAnswers(prev => ({
      ...prev,
      businessName: searchParams.get('businessName') || '',
      firstName: searchParams.get('firstName') || '',
      lastName: searchParams.get('lastName') || '',
    }));
  }, [searchParams]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
        setAuthStatus('authenticated');
      } catch (err) {
        setAuthStatus('unauthenticated');
      }
    };
    checkSession();
  }, []);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSelect = (field, value) => {
    if (field === 'channels') {
      setAnswers(prev => ({
        ...prev,
        channels: prev.channels.includes(value)
          ? prev.channels.filter(c => c !== value)
          : [...prev.channels, value]
      }));
    } else {
      setAnswers(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidateReferral = async () => {
    if (!referralCode) {
      // If no code, just finish the setup
      await handleFinish();
      return;
    }
    setIsLoading(true);
    setReferralStatus({ status: 'validating', message: 'Checking code...', details: null });
    try {
      const result = await functions.createExecution('validateReferralCode', JSON.stringify({ code: referralCode }));
      const response = JSON.parse(result.response);

      if (result.status === 'completed' && response.success) {
        setReferralStatus({ status: 'valid', message: '', details: response.data });
        setShowCelebration(true);
        controls.start({
          scale: [1, 1.2, 1],
          transition: { duration: 0.5, ease: "easeInOut" },
        });
        // Wait for celebration, then finish
        setTimeout(() => {
          setShowCelebration(false);
          handleFinish(response.data);
        }, 3000); // 3-second celebration
      } else {
        throw new Error(response.message || 'Invalid referral code.');
      }
    } catch (e) {
      setReferralStatus({ status: 'invalid', message: e.message, details: null });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async (referralDetails) => {
    setIsLoading(true);
    setError('');
    try {
      // Generate a URL-friendly slug from the business name
      const generateSubdomain = (name) => {
        const baseSlug = name.toLowerCase()
          .replace(/&/g, 'and')      // Replace & with 'and'
          .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
          .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
        
        // Add a short random string to ensure uniqueness
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        return `${baseSlug}-${randomSuffix}`;
      };

      const user = await account.get();
      const profileData = {
        userId: user.$id,
        email: user.email,
        subdomain: generateSubdomain(answers.businessName),
        ...answers,
      };

      // Use upsert logic: try to create, if it fails (already exists), then update.
      await databases.createDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        user.$id,
        profileData
      ).catch(async (err) => {
        if (err.code === 409) { // 409 is the code for "Document already exists"
          await databases.updateDocument(
            DATABASE_ID,
            PROFILES_COLLECTION_ID,
            user.$id,
            profileData
          );
        } else {
          throw err; // Re-throw other errors
        }
      });

      const query = new URLSearchParams();
      if (referralDetails) {
        query.set('discount', referralDetails.discountPercent);
        query.set('code', referralCode);
      }

      router.push(`/pricing?${query.toString()}`);
    } catch (err) {
      console.error("Failed to save onboarding data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const Step1Component = answers.businessName ? 'div' : 'form';
  const Step2Component = answers.firstName ? 'div' : 'form';

  if (authStatus === 'loading') {
    return (
      <Loader message="Verifying your session..." />
    );
  }

  if (authStatus === 'unauthenticated') {
    // This can happen if the OAuth flow fails or the session expires.
    router.replace('/login');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <NextImage src="/logo.png" alt="Collabriss Logo" width={1000} height={35} className="h-40 w-auto mx-auto" priority />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
          <motion.div
            className="bg-[#2EBF83] h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">What is your business name?</h1>
                <p className="text-slate-500 text-center mb-8">This will be the name of your Collabriss store.</p>
                <Step1Component onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                    <input type="text" id="businessName" name="businessName" required value={answers.businessName} onChange={handleChange} className="w-full px-4 py-3 border outline-0 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" disabled={!!searchParams.get('businessName')} />
                  </div>
                  <button type="submit" onClick={handleNext} className="w-full bg-[#2EBF83] text-white font-bold py-3 rounded-lg text-lg hover:bg-green-600 transition-colors mt-2">Next</button>
                </Step1Component>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Tell us about yourself</h1>
                <Step2Component onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input type="text" id="firstName" name="firstName" required value={answers.firstName} onChange={handleChange} className="w-full px-4 py-3 border outline-0 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" disabled={!!searchParams.get('firstName')} />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input type="text" id="lastName" name="lastName" required value={answers.lastName} onChange={handleChange} className="w-full px-4 py-3 border outline-0 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" disabled={!!searchParams.get('lastName')} />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={handleBack} className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-lg text-lg hover:bg-slate-300 transition-colors">Back</button>
                    <button type="submit" onClick={handleNext} className="w-full bg-[#2EBF83] text-white font-bold py-3 rounded-lg text-lg hover:bg-green-600 transition-colors">Next</button>
                  </div>
                </Step2Component>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">What do you sell?</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {productCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { handleSelect('category', cat); handleNext(); }}
                      className="p-4 border border-slate-300 rounded-lg text-center text-slate-700 font-medium hover:bg-[#2EBF83] hover:text-white hover:border-[#2EBF83] transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">How do you currently sell?</h1>
                <p className="text-center text-slate-500 mb-6 -mt-4">Select all that apply.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {sellingChannels.map(channel => (
                    <button
                      key={channel}
                      onClick={() => handleSelect('channels', channel)}
                      className={`p-4 border rounded-lg text-center font-medium transition-colors ${
                        answers.channels.includes(channel)
                          ? 'bg-[#2EBF83] text-white border-[#2EBF83]'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={handleBack} disabled={isLoading} className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-lg text-lg hover:bg-slate-300 transition-colors disabled:opacity-50">Back</button>
                  <button type="button" onClick={handleNext} disabled={isLoading} className="w-full bg-[#2EBF83] text-white font-bold py-3 rounded-lg text-lg hover:bg-green-600 transition-colors disabled:opacity-50">Next</button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">What&apos;s your phone number?</h1>
                <p className="text-center text-slate-500 mb-6 -mt-4">This will be used for order notifications. (e.g., +1234567890)</p>
                <form onSubmit={(e) => { e.preventDefault(); handleValidateReferral(); }} className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" id="phone" name="phone" required value={answers.phone} onChange={handleChange} className="w-full px-4 py-3 border outline-0 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" />
                  </div>
                  <div className="pt-2">
                    <label htmlFor="referralCode" className="block text-sm font-medium text-slate-700 mb-1">Referral Code (Optional)</label>
                    <input type="text" id="referralCode" name="referralCode" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className="w-full px-4 py-3 border outline-0 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" />
                    {referralStatus.status === 'invalid' && <p className="text-red-500 text-xs mt-1">{referralStatus.message}</p>}
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={handleBack} disabled={isLoading} className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-lg text-lg hover:bg-slate-300 transition-colors disabled:opacity-50">Back</button>
                    <button type="submit" disabled={isLoading} className="w-full bg-[#2EBF83] text-white font-bold py-3 rounded-lg text-lg hover:bg-green-600 transition-colors disabled:bg-green-300 flex items-center justify-center">
                      {isLoading ? 'Please wait...' : 'Finish Setup'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
          {showCelebration && referralStatus.details && (
            <motion.div
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div animate={controls}>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-slate-900">Referral Code Applied!</h2>
                <p className="text-slate-600 mt-2">
                  Your code from <span className="font-bold">{referralStatus.details.userName}</span> gives you a <span className="font-bold">{referralStatus.details.discountPercent}%</span> discount!
                </p>
              </motion.div>
            </motion.div>
          )}
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
                  