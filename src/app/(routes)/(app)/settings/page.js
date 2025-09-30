'use client';

import { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { account } from '@/app/lib/appwrite';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SettingsCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-4 mb-6">{title}</h2>
    {children}
  </div>
);

const InfoRow = ({ label, value, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-slate-100 last:border-b-0">
    <p className="text-sm font-medium text-slate-500 mb-1 sm:mb-0">{label}</p>
    {children ? (
      <div className="flex items-center gap-2">{children}</div>
    ) : (
      <p className="text-sm text-slate-800 font-semibold">{value}</p>
    )}
  </div>
);

export default function SettingsPage() {
  const { profile, user } = useAppContext();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
      // Optionally show an error message to the user
    }
  };

  const storeUrl = profile?.subdomain ? `https://${profile.subdomain}.collabriss.site` : '';

  const handleCopy = () => {
    if (!storeUrl) return;
    navigator.clipboard.writeText(storeUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SettingsCard title="Profile Information">
            <InfoRow label="First Name" value={profile?.firstName} />
            <InfoRow label="Last Name" value={profile?.lastName} />
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="Phone Number" value={profile?.phone || 'Not provided'} />
          </SettingsCard>

          <SettingsCard title="Business Information">
            <InfoRow label="Business Name" value={profile?.businessName} />
            <InfoRow label="Store URL">
              <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 font-semibold hover:underline truncate">
                {storeUrl}
              </a>
              <button
                onClick={handleCopy}
                className="text-xs bg-slate-100 text-slate-600 font-semibold py-1 px-2 rounded-md hover:bg-slate-200 transition-colors"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </InfoRow>
          </SettingsCard>
        </div>

        <div className="lg:col-span-1">
          <SettingsCard title="Subscription">
            <div className="text-center">
              <p className="text-sm text-slate-500">Current Plan</p>
              <p className="text-2xl font-bold text-[#2EBF83] capitalize my-2">{profile?.subscriptionPlan || 'Free'}</p>
              {profile?.subscriptionStatus === 'on-hold' && (
                <p className="text-xs text-red-600 mt-1">Your subscription is on hold due to a payment issue.</p>
              )}
              <Link
                href="/pricing"
                className="mt-4 inline-block w-full bg-[#2EBF83] text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-green-600 transition-colors"
              >
                Manage Subscription
              </Link>
            </div>
          </SettingsCard>

          <SettingsCard title="Account">
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-600 hover:bg-red-50 p-3 rounded-md transition-colors text-sm font-medium"
            >
              Log Out
            </button>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}