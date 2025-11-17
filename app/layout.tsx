import '../src/App.css';
import '../src/index.css';
// app/layout.tsx
import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Navigation } from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';

export const metadata: Metadata = {
  title: 'Moriartyy',
  description: 'Moriartyy.',
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
          {children}       {/* konten halaman */}
          <CustomCursor /> {/* cursor global */}
        </ThemeProvider>
      </body>
    </html>
  );
}