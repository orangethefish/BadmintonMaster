'use client'

import React, { useState, ChangeEvent } from 'react';

function LanguageSwitcher() {
  const [language, setLanguage] = useState('en'); 

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="relative">
      <select 
        value={language} 
        onChange={handleLanguageChange}
        className="appearance-none bg-black text-white px-4 py-2 pr-8 rounded-md cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="vn">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default LanguageSwitcher;