import {useTranslations} from 'next-intl';
import {Link} from '@src/i18n/routing';
import LanguageSwitcher from '@components/LanguageSwitcher';
import Image from 'next/image';

export default function HomePage() {
  const t = useTranslations('Index');
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        
        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
          >
            {t('createButton')}
          </button>
          
          <button
            className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
          >
            {t('joinButton')}
          </button>
        </div>
      </div>
    </main>
  );
}