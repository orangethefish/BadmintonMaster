import {useTranslations} from 'next-intl';
import {Link} from '@src/i18n/routing';

export default function HomePage() {
  const t = useTranslations('Index');
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Tournament Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="bg-[#39846d] p-4">
              <svg 
                className="w-8 h-8 text-white mx-auto" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('createButton')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('createDescription')}
              </p>
              <Link href="/tournament/new">
                <button className="w-full bg-[#39846d] text-white rounded-lg py-3 px-4 hover:bg-[#2c6353] transition-colors duration-200 font-medium text-lg">
                  {t('createButton')}
                </button>
              </Link>
            </div>
          </div>

          {/* Join Tournament Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="bg-[#39846d] p-4">
              <svg 
                className="w-8 h-8 text-white mx-auto" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('joinButton')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('joinDescription')}
              </p>
              <Link href="/tournament/join">
                <button className="w-full bg-white text-[#39846d] border-2 border-[#39846d] rounded-lg py-3 px-4 hover:bg-[#39846d] hover:text-white transition-colors duration-200 font-medium text-lg">
                  {t('joinButton')}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">{t('features.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="bg-[#39846d] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl text-black font-semibold mb-2">{t('features.management.title')}</h3>
              <p className="text-gray-600">{t('features.management.description')}</p>
            </div>
            <div className="p-6">
              <div className="bg-[#39846d] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl text-black font-semibold mb-2">{t('features.updates.title')}</h3>
              <p className="text-gray-600">{t('features.updates.description')}</p>
            </div>
            <div className="p-6">
              <div className="bg-[#39846d] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl text-black font-semibold mb-2">{t('features.scheduling.title')}</h3>
              <p className="text-gray-600">{t('features.scheduling.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}