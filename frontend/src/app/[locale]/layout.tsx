import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@src/i18n/routing';
import {Metadata} from 'next';
import HeaderComponent from './components/HeaderComponent';
import { Toaster } from 'react-hot-toast';
import { param } from 'framer-motion/client';

export const metadata: Metadata = {
  icons: {
    icon: '/icon.ico',
  }
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <HeaderComponent />
          <div className="main-content" suppressHydrationWarning>
            {children}
          </div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}