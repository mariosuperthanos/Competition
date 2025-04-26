'use client';

import { useState } from 'react';
import NavBar from './navbar/NavBar';
import CookieSetter from './CookieSetter';
import AuthProvider from './auth/AuthProvider';

export default function LayoutContent({ 
  children, 
  session, 
  initialCookieState 
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
          <div style={{ paddingTop: "13px", paddingLeft: "13px" }}>
            <NavBar />
          </div>
          <AuthProvider session={session}>{children}</AuthProvider>
        </>
      )}
    </>
  );
}