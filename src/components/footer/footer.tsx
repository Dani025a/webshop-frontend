export default function Footer() {
    return (
      <footer className="w-full border-t bg-gray-50 mt-auto">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 uppercase">
            © {new Date().getFullYear()} dgelectronics.dk all rights reserved.
          </p>
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <a
              href="/personal-data-policy"
              className="text-sm text-gray-600 hover:text-gray-900 uppercase transition-colors"
            >
              Personal Data Policy
            </a>
            <a
              href="/use-of-cookies"
              className="text-sm text-gray-600 hover:text-gray-900 uppercase transition-colors"
            >
              Use of Cookies
            </a>
            <a
              href="/personal-information"
              className="text-sm text-gray-600 hover:text-gray-900 uppercase transition-colors"
            >
              Personal Information
            </a>
          </nav>
        </div>
      </footer>
    )
  }
  
  