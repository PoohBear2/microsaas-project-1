'use client'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { RegisterLink, LoginLink, LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

export default function Navbar() {
  const { getUser, isLoading } = useKindeBrowserClient();
  const user = getUser();

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold text-gray-900">
              DataExtract
            </a>
          </div>

          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
            >
              Home
            </a>
            <a 
              href="/#about" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
            >
              About
            </a>
            <a 
              href="/#pricing" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
            >
              Pricing
            </a>
            <a 
              href="/#contact" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
            >
              Contact
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            
            {isLoading ? (
              <p> Loading... </p>
            ) : user ? (
              <>
                <span className="text-sm text-gray-700 hidden md:inline">
                  {user.given_name}
                </span>
                <LogoutLink className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Logout
                </LogoutLink>
              </>
            ) : (
              <>
                <LoginLink className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Login
                </LoginLink>
                <RegisterLink className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Sign Up
                </RegisterLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}