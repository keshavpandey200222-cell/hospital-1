import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { DemoDataProvider } from '../context/DemoDataContext'
import { ThemeProvider } from '../context/ThemeContext'
import '../i18n'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <DemoDataProvider>
        <div className="min-h-screen transition-colors duration-300 dark:bg-theme-bg dark:text-white bg-white text-black">
          <Component {...pageProps} />
        </div>
      </DemoDataProvider>
    </ThemeProvider>
  )
}
