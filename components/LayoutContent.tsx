'use client';

import { useState } from 'react';
import NavBar from './navbar/NavBar';
import CookieSetter from './CookieSetter';
import AuthProvider from './auth/AuthProvider';

import { ReactNode } from 'react';

export default function LayoutContent({
  children,
  session,
  initialCookieState,
  hasUnread
}: {
  children: ReactNode;
  session: any;
  initialCookieState: boolean;
  hasUnread: boolean;
}) {
  const [cookieSet, setCookieSet] = useState(initialCookieState);
  const [isLoading, setIsLoading] = useState(!initialCookieState);

  const handleCookieSet = () => {
    setCookieSet(true);
    setIsLoading(false);
  };

  return (
    <>
      {!cookieSet && (
        <CookieSetter onComplete={handleCookieSet} />
      )}

      {(cookieSet || !isLoading) && (
        <>
          <NavBar isLoggedIn={session} hasUnread={hasUnread} />
          <main className="pt-0 pl-0">
            <AuthProvider session={session}>{children}</AuthProvider>
          </main>
        </>
      )}
    </>
  );
}