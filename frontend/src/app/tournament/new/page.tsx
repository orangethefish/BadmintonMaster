'use client';

import { useRouter } from 'next/navigation';

export default function NewTournament() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Create New Tournament</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-600 mb-4">Tournament creation form will be implemented here.</p>
          {/* Tournament creation form will be added here */}
        </div>
      </div>
    </main>
  );
} 