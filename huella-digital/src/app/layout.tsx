import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Huella Digital - Descubre y controla tu presencia en internet',
  description: 'Encuentra dónde aparece tu información online y ejerce tu derecho al olvido con solicitudes GDPR generadas automáticamente.',
  keywords: ['huella digital', 'privacidad', 'GDPR', 'derecho al olvido', 'protección de datos'],
  authors: [{ name: 'Huella Digital' }],
  openGraph: {
    title: 'Huella Digital - Descubre y controla tu presencia en internet',
    description: 'Encuentra dónde aparece tu información online y ejerce tu derecho al olvido.',
    url: 'https://huelladigital.app',
    siteName: 'Huella Digital',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Huella Digital',
    description: 'Descubre y controla tu presencia en internet',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
