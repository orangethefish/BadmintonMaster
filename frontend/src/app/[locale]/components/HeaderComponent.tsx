'use client'

import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderComponentProps {
    title?: string;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ title }) => {
    const pathname = usePathname();
    const isHomePage = pathname === '/en' || pathname === '/vn';

    return (
        <header className="bg-[#39846d] text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-4">
                        <Link 
                            href="/"
                            className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
                        >
                            <svg 
                                className="h-8 w-8" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                                />
                            </svg>
                            <span className="text-xl font-bold">Badminton Master</span>
                        </Link>
                        {!isHomePage && title && (
                            <>
                                <span className="text-gray-300">/</span>
                                <h1 className="text-lg font-medium">{title}</h1>
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderComponent;