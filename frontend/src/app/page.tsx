'use client';

import { useEffect, useState } from 'react';

interface Example {
  id: number;
  name: string;
  created_at: string;
}

export default function Home() {
  const [examples, setExamples] = useState<Example[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/examples');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setExamples(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExamples();
  }, []);

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">Full Stack App Demo</h1>
      
      {loading && (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Examples from Backend:</h2>
          {examples.length === 0 ? (
            <p className="text-gray-500">No examples found in the database.</p>
          ) : (
            <ul className="space-y-2">
              {examples.map((example) => (
                <li key={example.id} className="border-b py-2">
                  <p className="font-medium">{example.name}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(example.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
