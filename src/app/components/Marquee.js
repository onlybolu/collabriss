import React from 'react';

// App attributes with icons
const attributes = [
  { icon: '🛒', text: 'Online Store' },
  { icon: '📦', text: 'Inventory Management' },
  { icon: '💳', text: 'Secure Payments' },
  { icon: '👥', text: 'Customer Management' },
  { icon: '🧾', text: 'Invoicing' },
  { icon: '📊', text: 'Analytics' },
  { icon: '📱', text: 'Mobile First' },
  { icon: '💬', text: '24/7 Support' },
];

export default function Marquee() {
  const marqueeAttributes = [...attributes, ...attributes,...attributes, ...attributes]; // Duplicate for seamless loop

  return (
    <div className="py-12 bg-white">
        <div className="text-center mb-8">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Everything you need to run your business</p>
        </div>
        <div className="group relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:w-24 before:h-full before:bg-gradient-to-r before:from-white before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:w-24 after:h-full after:bg-gradient-to-l after:from-white after:to-transparent after:z-10">
            <div className="flex animate-marquee [will-change:transform] group-hover:[animation-play-state:paused]">
                {marqueeAttributes.map((attribute, index) => (
                    <div key={index} className="flex items-center flex-shrink-0 mx-8">
                        <span className="text-2xl mr-3">{attribute.icon}</span>
                        <span className="text-xl font-medium text-slate-700">{attribute.text}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}