const LOCAL_API_BASE_URL = 'http://localhost:8080';
const PRODUCTION_API_BASE_URL = 'https://hms-backend-76lf.onrender.com';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const isLocalBrowser = () =>
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const getApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (configuredUrl) {
    return trimTrailingSlash(configuredUrl);
  }

  return isLocalBrowser() ? LOCAL_API_BASE_URL : PRODUCTION_API_BASE_URL;
};

export const getSockJsUrl = () => `${getApiBaseUrl()}/ws`;
