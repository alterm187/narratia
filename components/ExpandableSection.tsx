'use client';

import { useState } from 'react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: string;
  className?: string;
}

export default function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
  icon = '▼',
  className = '',
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`border border-[#2a332a]/20 bg-white/50 backdrop-blur-sm overflow-hidden transition-all ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#f1ede9]/50 transition-colors group"
        aria-expanded={isExpanded}
      >
        <h3 className="text-xl font-bold text-[#2a332a] group-hover:text-[#ffbd59] transition-colors">
          {title}
        </h3>
        <span
          className={`text-[#2a332a] text-xl transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          {icon}
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 pt-0 border-t border-[#2a332a]/10">
          {children}
        </div>
      </div>
    </div>
  );
}
