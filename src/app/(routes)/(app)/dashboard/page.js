'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import OnboardingNotice from '@/app/(routes)/(app)/components-dashboard/OnboardingNotice';
import TodoList from '@/app/(routes)/(app)/components-dashboard/TodoList';
import { useAppContext } from '@/app/context/AppContext';
// import Walkthrough from '@/app/(routes)/(app)/components-dashboard/Walkthrough';
import SalesChart from '@/app/(routes)/(app)/components-dashboard/SalesChart';
import ChartBarIcon from '@/app/components/icons/ChartBarIcon';
import ClipboardListIcon from '@/app/components/icons/ClipboardListIcon';
import GiftIcon from '@/app/components/icons/GiftIcon';
import BoltIcon from '@/app/components/icons/BoltIcon';
import DocumentTextIcon from '@/app/components/icons/DocumentTextIcon';
import { databases, Query, PRODUCTS_COLLECTION_ID, ORDERS_COLLECTION_ID } from '@/app/lib/appwrite';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className="bg-green-100 text-[#2EBF83] p-3 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

const DateRangeFilter = ({ selectedRange, setSelectedRange }) => {
  const ranges = [
    { key: 'today', label: 'Today' },
    { key: 'last7days', label: 'Last 7 Days' },
    { key: 'last30days', label: 'Last 30 Days' },
    { key: 'all_time', label: 'All Time' },
  ];

  return (
    <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
      {ranges.map(range => (
        <button
          key={range.key}
          onClick={() => setSelectedRange(range.key)}
          className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            selectedRange === range.key
              ? 'bg-white text-slate-900 shadow-sm'
              : 'bg-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

const DashboardCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg shadow-sm">
    <div className="p-4 border-b border-slate-100 flex items-center gap-3">
      {icon}
      <h2 className="font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const QuickActionButton = ({ href, children }) => (
  <Link href={href} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
    <span>{children}</span>
    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
  </Link>
);

const ReferAndEarnBanner = ({ profile }) => {
  const [isCopied, setIsCopied] = useState(false);
  const referralLink = `https://collabriss.site/signup?ref=${profile?.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
      <h3 className="font-bold text-lg mb-2">Refer & Earn</h3>
      <p className="text-sm text-green-100 mb-4">Share your referral link and earn rewards when your friends subscribe!</p>
      <button onClick={handleCopy} className="w-full bg-white text-green-700 font-bold py-2 px-4 rounded-lg text-sm hover:bg-green-50 transition-colors">
        {isCopied ? 'Copied!' : 'Copy Your Link'}
      </button>
    </div>
  );
};

export default function DashboardPage() {
  const { user, profile, showWalkthrough, setShowWalkthrough } = useAppContext();
  const isFreePlan = !profile?.subscriptionPlan || profile.subscriptionPlan === 'free';
  const [dateRange, setDateRange] = useState('last30days');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, newCustomers: 0 });
  const [chartData, setChartData] = useState([]);

  // Fetch products to check for the "Add your first product" to-do item
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [Query.equal('userId', user.$id), Query.limit(1)] // Only need to know if at least one exists
        );
        setProducts(response.documents);
      } catch (error) {
        console.error('Failed to fetch products for to-do list:', error);
      } finally {
        // This loading state is now part of the main loading
      }
    };
    fetchProducts();
  }, [user]);

  // Fetch and process orders for stats and chart
  useEffect(() => {
    const fetchAndProcessOrders = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          ORDERS_COLLECTION_ID,
          [Query.equal('userId', user.$id), Query.limit(5000)] // Fetch a large number for stats
        );
        const orders = response.documents;

        // Process stats
        const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = orders.length;
        // You would calculate new customers based on a customer collection
        setStats({ totalSales, totalOrders, newCustomers: 0 });

        // Process chart data (example for last 30 days)
        const days = 30;
        const today = new Date();
        const dailySales = Array(days).fill(0).map((_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (days - 1 - i));
          return {
            date: date.toISOString().split('T')[0],
            total: 0,
          };
        });

        orders.forEach(order => {
          const orderDate = order.$createdAt.split('T')[0];
          const dayData = dailySales.find(d => d.date === orderDate);
          if (dayData) {
            dayData.total += order.totalAmount;
          }
        });

        const formattedChartData = dailySales.map(d => ({
          name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          total: d.total,
        }));
        setChartData(formattedChartData);

      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndProcessOrders();
  }, [user, dateRange]);

  // useEffect(() => {
  //   const hasSeenWalkthrough = localStorage.getItem('walkthroughCompleted');
  //   if (!hasSeenWalkthrough) {
  //     setShowWalkthrough(true);
  //   }
  // }, [setShowWalkthrough]);

  // const handleCloseWalkthrough = () => {
  //   setShowWalkthrough(false);
  //   localStorage.setItem('walkthroughCompleted', 'true');
  // };

  return (
    <div>
      {/* <Walkthrough isOpen={showWalkthrough} onClose={handleCloseWalkthrough} /> */}
      
      {/* Onboarding notice appears at the very top */}
      {profile && <OnboardingNotice profile={profile} />}

      {/* Onboarding notice appears at the very top */}
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 ">Welcome, {profile?.firstName}!</h1>
      <p className="text-green-700 text-sm mb-6 font-extrabold">Hi {profile?.firstName}, Have good sales today!! 😌 </p>
      {isFreePlan && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-8" role="alert">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">You are on the Free Plan</p>
              <p className="text-sm">Upgrade to unlock more features and grow your business.</p>
            </div>
            <Link href="/pricing" className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-yellow-600 transition-colors flex-shrink-0">Upgrade Now</Link>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div id="business-overview" className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-lg font-bold text-slate-900">Business Overview</h2>
              <DateRangeFilter selectedRange={dateRange} setSelectedRange={setDateRange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="Total Sales" value={`₦${stats.totalSales.toLocaleString()}`} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>} />
              <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>} />
              <StatCard title="New Customers" value={stats.newCustomers.toLocaleString()} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0112 13a5.995 5.995 0 01-3 5.197"></path></svg>} />
            </div>

            <div className="mt-8">
              <h3 className="text-md font-semibold text-slate-800 mb-4">Sales Trend</h3>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg"><p className="text-slate-500">Loading chart data...</p></div>
              ) : chartData.length > 0 ? (
                <SalesChart data={chartData} />
              ) : (
                <div className="h-64 bg-slate-50 rounded-lg flex flex-col items-center justify-center text-center text-slate-500 border border-dashed">
                  <ChartBarIcon className="w-10 h-10 mb-2 text-slate-400" />
                  <p className="font-medium">No sales data to display</p>
                  <p className="text-sm">Start making sales to see your data.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders Section */}
          <DashboardCard title="Recent Orders" icon={<DocumentTextIcon className="w-5 h-5 text-purple-600" />}>
            <div className="text-center text-slate-500 py-12">
              <p className="text-lg font-medium">No orders to show</p>
              <p className="text-sm mt-1">Your most recent orders will appear here once you make a sale.</p>
              <Link href="/orders/new" className="mt-4 inline-block text-sm font-semibold text-green-600 hover:underline">
                Create a manual order
              </Link>
            </div>
          </DashboardCard>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="lg:col-span-1 space-y-8">
            <DashboardCard title="To-do List" icon={<ClipboardListIcon className="w-5 h-5 text-blue-600" />} id="todo-list">
              {profile && !isLoading ? (
                <TodoList profile={profile} products={products} />
              ) : <p className="text-sm text-slate-500">Loading...</p>}
            </DashboardCard>
          </div>
          
          {profile?.referralCode && <ReferAndEarnBanner profile={profile} />}
          
          <DashboardCard title="Quick Actions" icon={<BoltIcon className="w-5 h-5 text-yellow-600" />} id="quick-actions">
            <QuickActionButton href="/products/new">Add a New Product</QuickActionButton>
            <QuickActionButton href="/orders/new">Create an Invoice</QuickActionButton>
            <QuickActionButton href="/customers/new">Add a New Customer</QuickActionButton>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
