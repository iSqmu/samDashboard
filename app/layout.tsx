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
      <body className="bg-dark min-h-screen min-w-screen text-light">
        <Header />
        <main className="flex min-w-screen overflow-x-hidden">{children}</main>
      </body>
    </html>
  );
}
