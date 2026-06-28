'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

export function DecorationMethod({ methods }: { methods: string[] }) {
  const [active, setActive] = useState(methods[0]);

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-lg border-2 border-sky-400">
      {methods.map((method) => (
        <button
          key={method}
          type="button"
          onClick={() => setActive(method)}
          className={cn(
            'px-4 py-3 text-sm font-bold transition',
            active === method
              ? 'bg-[#4b4a40] text-white'
              : 'bg-white text-[#1c1b18] hover:bg-black/5',
          )}
        >
          {method}
        </button>
      ))}
    </div>
  );
}
