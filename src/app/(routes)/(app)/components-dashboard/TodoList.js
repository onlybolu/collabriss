'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import CheckCircleIcon from '@/app/components/icons/CheckCircleIcon';
import ChevronRightIcon from '@/app/components/icons/ChevronRightIcon';

const TodoTask = ({ title, isCompleted, href }) => (
  <Link href={href} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-3">
      <CheckCircleIcon className={`w-6 h-6 ${isCompleted ? 'text-green-500' : 'text-slate-300'}`} />
      <span className={`font-medium ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
        {title}
      </span>
    </div>
    {!isCompleted && <ChevronRightIcon className="w-5 h-5 text-slate-400" />}
  </Link>
);

export default function TodoList({ profile, products }) {
  const todoTasks = useMemo(() => [
    {
      id: 'first-product',
      title: 'Add your first product',
      isCompleted: products.length > 0,
      href: '/products/new',
    },
    {
      id: 'share-store',
      title: 'Share your store with customers',
      isCompleted: false, // This could be tracked later
      href: '/settings', // Link to settings to copy the URL
    },
  ], [products]);

  return (
    <div className="space-y-1">{todoTasks.map(task => <TodoTask key={task.id} {...task} />)}</div>
  );
}