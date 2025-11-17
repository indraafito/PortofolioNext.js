import '../src/App.css';
import '../src/index.css';
// app/layout.tsx
import { ThemeProvider } from '@/contexts/ThemeContext';
import {Navigation} from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';

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

