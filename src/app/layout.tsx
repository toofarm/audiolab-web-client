import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Components
import Header from "@/components/Header";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LoadingProvider } from "@/contexts/LoadingContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import NavigationLoading from "@/components/NavigationLoading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AudioLab",
  description: "Your personal audio analysis platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <LoadingOverlay />
          <NavigationLoading />
        </LoadingProvider>
      </body>
    </html>
  );
}
