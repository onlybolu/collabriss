'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-lg rounded-lg border border-slate-200">
        <p className="font-bold text-slate-800">{label}</p>
        <p className="text-sm text-green-600">Sales: ₦{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function SalesChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(value) => `₦${value / 1000}k`} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey="total" fill="#2EBF83" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}