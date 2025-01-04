'use client'

import { useTranslations } from 'next-intl';
import { Link } from '@src/i18n/routing';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceFactory } from '@/services/service.factory';
import { NotificationService } from '@/services/notification/notification.service';

export default function JoinTournamentPage() {
  const t = useTranslations('JoinTournament');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const authService = ServiceFactory.getAuthService();
  const [tournamentCode, setTournamentCode] = useState('');

  useEffect(() => {
    const user = authService.getUser();
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement tournament join logic here
      NotificationService.success(t('notifications.joinSuccess'));
      router.push(`/tournament/join/${tournamentCode}`);
    } catch (error) {
      NotificationService.error(t('errors.joinFailed'));
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 relative text-black">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="tournamentCode" className="block text-sm font-medium text-gray-700">
              {t('codeLabel')}
            </label>
            <input
              type="text"
              id="tournamentCode"
              value={tournamentCode}
              onChange={(e) => setTournamentCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d]"
              required
              placeholder={t('codePlaceholder')}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-[#39846d] text-white rounded-md py-2 px-4 hover:bg-[#2c6353]"
            >
              {t('joinButton')}
            </button>
            <Link href="/" className="flex-1">
              <button
                type="button"
                className="w-full bg-gray-50 text-gray-700 rounded-md py-2 px-4 border border-gray-300 hover:bg-gray-100"
              >
                {t('cancelButton')}
              </button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
} 