import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css'
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
// import 'leaflet/dist/leaflet.css';
import { cookies } from "next/headers";
import { Suspense } from "react";
import LayoutContent from "../../components/LayoutContent";
import QueryProvider from "../../components/QueryProvider";
import hasUnreadNotifications from "../../library/notifications/hasUnread";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, cookieStore] = await Promise.all([
    getServerSession(authOptions),
    cookies(),
  ]);

  const encoded = cookieStore.get('timezoneData')?.value;
  let decoded, timezoneData, timezone;
  if (encoded) {
    decoded = decodeURIComponent(encoded);
    timezoneData = JSON.parse(decoded);
    timezone = timezoneData.data.timezone;
    console.log(timezone);
  }

  const isCookie =
    cookieStore.get("timezoneData") == null ||
      cookieStore.get("timezoneData") == undefined
      ? false
      : true;
  let hasUnread;
  console.log('session?.user.id', session);
  if (isCookie) {
    hasUnread = await hasUnreadNotifications(session?.token.id, timezone);
  }
  console.log('isCookie', isCookie);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`}
      >
        <Suspense fallback={<></>}>
          <QueryProvider>
            <LayoutContent
              session={session}
              initialCookieState={isCookie}
              hasUnread={hasUnread}
            >
              {children}
            </LayoutContent>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
