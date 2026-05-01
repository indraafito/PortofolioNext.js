import '../src/App.css';
import '../src/index.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Navigation } from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/contexts/ScrollToTop';

export const metadata: Metadata = {
  title: {
    default: 'Afito Indra Permana | Front-End Developer',
    template: '%s | Afito Indra Permana',
  },
  description: 'Mahasiswa S1 Teknik Informatika Universitas Negeri Malang, fokus pada Frontend Developer dan UI/UX Design, serta penerima Beasiswa Bank Indonesia 2025.',
  keywords: ['front-end developer', 'React developer', 'Next.js developer', 'web developer malang', 'freelance developer Indonesia'],
  authors: [{ name: 'Afito Indra Permana' }],
  metadataBase: new URL('https://afito-indra.vercel.app'),
  icons: {
    icon: '/favicon.png',
  },
  verification: {
    google: '8c6422a7af82cdd6',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://afito-indra.vercel.app',
    siteName: 'Afito Indra Permana Portfolio',
    title: 'Afito Indra Permana | Front-End Developer',
    description: 'Mahasiswa S1 Teknik Informatika Universitas Negeri Malang, fokus pada Frontend Developer dan UI/UX Design, serta penerima Beasiswa Bank Indonesia 2025.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Afito Indra Permana - Front-End Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Afito Indra Permana | Front-End Developer',
    description: 'Mahasiswa S1 Teknik Informatika Universitas Negeri Malang, fokus pada Frontend Developer dan UI/UX Design, serta penerima Beasiswa Bank Indonesia 2025.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Afito Indra Permana',
  jobTitle: 'Front-End Developer',
  url: 'https://afito-indra.vercel.app',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Malang',
    addressCountry: 'ID',
  },
  sameAs: [
    'https://linkedin.com/in/indraafito',
    'https://github.com/indraafito',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <Navigation />
          <ScrollToTop />
          <main className="pt-12">
            {children}
          </main>
          <CustomCursor />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
