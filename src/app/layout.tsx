import { CartProvider } from '../contexts/cartContext'
import Navbar from '../components/navbar/navbar'
import { Inter } from 'next/font/google'
import Breadcrumb from '@/components/ui/breadcrumb'
import './globals.css'
import Footer from '@/components/footer/footer'

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
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <Breadcrumb />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}

