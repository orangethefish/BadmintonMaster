import {useTranslations} from 'next-intl';
import {Link} from '@src/i18n/routing';
import LanguageSwitcher from '~/[locale]/components/LanguageSwitcher';
import Image from 'next/image';

export default function JoinTournamentPage() {
  const t = useTranslations('JoinTournament');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 relative">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="tournamentCode" className="block text-sm font-medium text-gray-700">
              {t('codeLabel')}
            </label>
            <input
              type="text"
              id="tournamentCode"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder={t('codePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
              {t('nameLabel')}
            </label>
            <input
              type="text"
              id="playerName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder={t('namePlaceholder')}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700"
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