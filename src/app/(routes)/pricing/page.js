'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { account, functions } from '@/app/lib/appwrite';

const PricingCard = ({ plan, price, features, isPopular, onSelect, isSelected, billingCycle }) => (
  <div
    role="radio"
    aria-checked={isSelected}
    tabIndex={0}
    className={`relative border rounded-lg p-8 cursor-pointer transition-all duration-300 ${isSelected ? 'border-[#2EBF83] ring-2 ring-[#2EBF83]' : 'border-slate-300 hover:border-slate-400'}`}
    onClick={onSelect}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
  >
    {isPopular && (
      <div className="absolute top-0 -translate-y-1/2 bg-[#2EBF83] text-white px-3 py-1 text-sm font-semibold rounded-full">
        Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold text-slate-900">{plan}</h3>
    <p className="text-4xl font-extrabold text-slate-900 my-4">
      ₦{price.toLocaleString()}
      <span className="text-base font-medium text-slate-500">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
    </p>
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3">
          <svg className="w-5 h-5 text-[#2EBF83]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <span className="text-slate-600">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

function PricingPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('starter'); // Default to the popular plan
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [error, setError] = useState('');

  const discountPercent = searchParams.get('discount');
  const referralCode = searchParams.get('code');

  // Define the plans with monthly and yearly prices in Naira
  const plans = useMemo(() => ({
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: ['Up to 25 products', 'Online Storefront', 'Basic Inventory', 'Community Support'],
    },
    starter: {
      name: 'Starter',
      price: { monthly: 4000, yearly: 40000 },
      features: ['Unlimited products', 'Custom Domain', 'Staff Accounts', 'Priority Support'],
      isPopular: true,
    },
    pro: {
      name: 'Pro',
      price: { monthly: 12500, yearly: 125000 },
      features: ['All Starter Features', 'Advanced Analytics', 'API Access', 'Dedicated Manager'],
    },
  }), []);

  const selectedPlanInfo = useMemo(() => plans[selectedPlan], [plans, selectedPlan]);
  const isFreePlanSelected = selectedPlan === 'free';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (e) {
        router.replace('/login');
      }
    };
    fetchUser();
  }, [router]);

  const getPrice = (plan) => {
    const originalPrice = plans[plan].price[billingCycle] || 0;
    if (discountPercent) {
      return originalPrice - (originalPrice * (parseInt(discountPercent, 10) / 100));
    }
    return originalPrice;
  };

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: `collabriss-${Date.now()}`,
    amount: getPrice(selectedPlan) || 0,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email,
      phone_number: user?.phone,
      name: user?.name,
    },
    customizations: {
      title: 'Inovareun - Collabriss',
      description: `Payment for ${selectedPlanInfo.name} Plan (${billingCycle})`,
      logo: '/logo.png', 
    },
  };

  const handleFlutterwavePayment = useFlutterwave(config);

  const handlePayment = () => {
    if (isFreePlanSelected) {
      // For the free plan, just go to the dashboard
      router.push('/dashboard?plan=free');
      return;
    }

    setIsLoading(true);
    setError('');
    handleFlutterwavePayment({
      callback: async (response) => {
        console.log('Flutterwave response:', response);
        if (response.status === 'successful') {
          try {
            // CRITICAL: Verify payment on the backend
            const result = await functions.createExecution(
              'verifyFlutterwavePayment',
              JSON.stringify({
                transactionId: response.transaction_id,
                expectedAmount: getPrice(selectedPlan),
                expectedCurrency: 'NGN',
                plan: selectedPlan,
                cycle: billingCycle,
              })
            );

            const functionResponse = JSON.parse(result.response);
            if (result.status === 'completed' && functionResponse.success) {
              // Payment verified successfully!
              router.push('/dashboard?payment=success');
            } else {
              throw new Error(functionResponse.message || 'Payment verification failed.');
            }
          } catch (e) {
            setError(`Verification Error: ${e.message}`);
          }
        } else {
          setError('Payment was not successful. Please try again.');
        }
        closePaymentModal();
        setIsLoading(false);
      },
      onClose: () => {
        setIsLoading(false);
      },
    });
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900">Choose Your Plan</h1>
        <p className="mt-4 text-lg text-slate-600">
          Start building your business with a plan that&apos;s right for you.
        </p>
        {discountPercent && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-200">
            🎉 Referral code <span className="font-bold">{referralCode}</span> applied! You get <span className="font-bold">{discountPercent}%</span> off.
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="bg-slate-200 p-1 rounded-lg flex gap-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow' : 'bg-transparent text-slate-600'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow' : 'bg-transparent text-slate-600'}`}
          >
            Yearly (Save ~16%)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-10 max-w-6xl mx-auto w-full">
        {Object.entries(plans).map(([planKey, planDetails]) => (
           <PricingCard
            key={planKey}
            plan={planDetails.name}
            price={getPrice(planKey)}
            features={planDetails.features}
            isPopular={planDetails.isPopular}
            onSelect={() => setSelectedPlan(planKey)}
            isSelected={selectedPlan === planKey}
            billingCycle={billingCycle}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center items-center gap-3">
        <input
          type="checkbox"
          id="autoRenew"
          checked={autoRenew}
          onChange={(e) => setAutoRenew(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-[#2EBF83] focus:ring-[#2EBF83]"
        />
        <label htmlFor="autoRenew" className="text-slate-700">Auto-renew my subscription</label>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="bg-[#2EBF83] text-white font-bold py-4 px-12 rounded-lg text-xl hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
        >
          {isLoading 
            ? 'Processing...' 
            : isFreePlanSelected 
              ? 'Continue to Dashboard' 
              : `Pay for ${selectedPlanInfo.name} Plan`}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Pricing...</div>}>
      <PricingPageComponent />
    </Suspense>
  );
}