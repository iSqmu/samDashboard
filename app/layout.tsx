import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import '@/styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Samu Dashboard',
    default: 'SamuDashboard',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen bg-dark text-light overflow-x-hidden">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
