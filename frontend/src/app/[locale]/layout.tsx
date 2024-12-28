import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@src/i18n/routing';
import {Metadata} from 'next';
import HeaderComponent from './components/HeaderComponent';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  icons: {
    icon: '/icon.ico',
  }
};

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <HeaderComponent />
          <div className="main-content">
            {children}
          </div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}