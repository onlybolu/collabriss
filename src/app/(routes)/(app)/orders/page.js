'use client';

export default function OrdersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center text-slate-500 py-16">
          <p className="text-lg">You have no orders yet.</p>
          <p className="text-sm mt-2">New orders from your customers will appear here.</p>
        </div>
      </div>
    </div>
  );
}