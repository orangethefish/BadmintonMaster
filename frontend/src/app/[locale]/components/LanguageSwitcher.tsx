'use client'

import React, { ChangeEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';

function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const currentLocale = pathname.split('/')[1];

  return (
    <div className="relative">
      <select 
        value={currentLocale} 
        onChange={handleLanguageChange}
        className="appearance-none bg-[#2c6353] text-white px-4 py-2 pr-8 rounded-md cursor-pointer hover:bg-[#225043] focus:outline-none focus:ring-2 focus:ring-[#225043] focus:ring-offset-2 focus:ring-offset-[#39846d] transition-colors duration-200"
      >
        <option value="vn">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-white">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default LanguageSwitcher;