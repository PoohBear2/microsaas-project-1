'use client'

import Link from 'next/link';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';

interface GradientButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  requireAuth?: boolean;
}

const GradientButton = ({ href, children, className = '', requireAuth = false }: GradientButtonProps) => {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  
  const defaultClasses = "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-500 hover:via-blue-600 hover:to-purple-700 text-white font-bold text-xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out inline-block";
  
  const buttonClasses = `${defaultClasses} ${className}`;

  // If authentication is required and user is not authenticated, show login link
  if (requireAuth && !isLoading && !isAuthenticated) {
    return (
      <LoginLink 
        className={buttonClasses}
        postLoginRedirectURL={href}
      >
        {children}
      </LoginLink>
    );
  }

  // Show loading state
  if (requireAuth && isLoading) {
    return (
      <div className={buttonClasses}>
        Loading...
      </div>
    );
  }

  // User is authenticated or auth not required, show normal link
  return (
    <Link href={href} className={buttonClasses}>
      {children}
    </Link>
  );
};

export default GradientButton;