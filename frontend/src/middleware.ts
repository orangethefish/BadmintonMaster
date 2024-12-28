import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['vn', 'en'],
 
  // Used when no locale matches
  defaultLocale: 'vn'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher:[
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ] // Exclude api, static, image, favicon
};