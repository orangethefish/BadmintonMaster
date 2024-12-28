'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LanguageSwitcher from '@components/LanguageSwitcher';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/icon.png"
              alt="Tournament Hub Icon"
              width={64}
              height={64}
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tournament Hub</h1>
          <p className="text-gray-600">Create or join a tournament to get started</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/tournament/new')}
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
          >
            Create New Tournament
          </button>
          
          <button
            onClick={() => router.push('/tournament/join')}
            className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
          >
            Join Existing Tournament
          </button>
        </div>
      </div>
    </main>
  );
}