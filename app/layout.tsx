import '../src/App.css';
import '../src/index.css';
// app/layout.tsx
import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Navigation } from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Afito Indra Permana | Front-End Developer',
  description: 'Afito Indra Permana | Front-End Developer.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ThemeProvider>
          <Navigation />   {/* header global */}
          <main className="pt-12">  {/* Top padding for main content */}
            {children}       {/* konten halaman */}
          </main>
          <CustomCursor /> {/* cursor global */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
