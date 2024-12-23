import { CartProvider } from '../contexts/cartContext'
import Navbar from '../components/navbar/navbar'
import { Inter } from 'next/font/google'
import Breadcrumb from '@/components/ui/breadcrumb'
import './globals.css'
import Footer from '@/components/footer/footer'
import { AuthProvider } from '@/contexts/authContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DG Electronics',
  description: 'Your one-stop shop for electronics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-full`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Breadcrumb />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
