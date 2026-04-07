import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { DemoDataProvider } from '../context/DemoDataContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DemoDataProvider>
      <Component {...pageProps} />
    </DemoDataProvider>
  )
}
