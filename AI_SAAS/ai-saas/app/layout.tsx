import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { ThemeProvider } from '@/components/theme-provider'
import { ToasterProvider } from '@/components/toaster-provider'
import { ModalProvider } from '@/components/modal-provider'
import { CrispProvider } from '@/components/crisp-provider'

import './globals.css'

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Genius AI — Your AI-Powered Generation Platform',
    template: '%s | Genius AI',
  },
  description: 'Generate conversations, images, music, videos, and code using AI. Free tier with 10 calls, Pro plan for unlimited usage.',
  keywords: ['AI', 'AI generation', 'image generation', 'music generation', 'video generation', 'code generation', 'conversation AI', 'Genius AI'],
  authors: [{ name: 'Genius AI' }],
  creator: 'Genius AI',
  publisher: 'Genius AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    siteName: 'Genius AI',
    title: 'Genius AI — Your AI-Powered Generation Platform',
    description: 'Generate conversations, images, music, videos, and code using AI.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Genius AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Genius AI — Your AI-Powered Generation Platform',
    description: 'Generate conversations, images, music, videos, and code using AI.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <CrispProvider />
        <body className={font.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToasterProvider />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
