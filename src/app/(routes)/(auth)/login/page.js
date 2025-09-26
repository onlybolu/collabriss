'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GoogleIcon from '@/app/components/icons/GoogleIcon';
import { account } from '@/app/lib/appwrite';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || isGoogleLoading) return;
    setError('');
    setIsLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      router.push('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      console.error('Failed to login:', error);
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (isLoading || isGoogleLoading) return;
    setIsGoogleLoading(true);
    account.createOAuth2Session(
      'google',
      `${window.location.origin}/dashboard`, 
      `${window.location.origin}/login`
    );
  };

  return (
    <div className="flex items-stretch min-h-screen bg-white">
      {/* Image Section */}
      <div className="w-1/2 hidden md:block relative">
        <div className="absolute inset-0 bg-black opacity-50 z-10" />
        <Link href="/" className="absolute top-8 left-8 z-20" aria-label="Go to homepage">
          <Image
            src="/logo.png"
            alt="Collabriss Logo"
            width={1000}
            height={40}
            className="h-40 w-auto invert brightness-0"
            priority
          />
        </Link>
        <Image src="/auth_bg.jpg" alt="Login Background" layout="fill" objectFit="cover" />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-4 sm:p-8">
        <Link href="/" className="md:hidden" aria-label="Go to homepage">
          <Image src="/logo.png" alt="Collabriss Logo" width={140} height={35} className="h-9 w-auto" priority />
        </Link>
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Log in to your account</h1>
          <button onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading} className="w-full py-3 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:cursor-not-allowed">
            {isGoogleLoading ? (
              <svg className="animate-spin h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : <GoogleIcon />}
            <span className="text-slate-700 font-medium">
              {isGoogleLoading ? 'Redirecting...' : 'Log in with Google'}
            </span>
          </button>
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-slate-300" />
            <span className="mx-4 text-sm font-medium text-slate-500">OR</span>
            <hr className="flex-grow border-t border-slate-300" />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border outline-0 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 outline-0 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2EBF83] focus:border-transparent transition-colors" />
            </div>
            <div>
              <button type="submit" disabled={isLoading || isGoogleLoading} className="w-full bg-[#2EBF83] text-white font-bold py-3 rounded-lg text-lg hover:bg-green-600 transition-colors mt-2 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center">
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>
        </div>
        <div className="mt-8 text-sm text-slate-600 text-center w-full max-w-md">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-[#2EBF83] hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}