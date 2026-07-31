import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "def_math - Welcome",
  description: "Minimal Next.js Boilerplate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKr.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-gray-50 text-black font-sans tracking-tight">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-8">
            <div className="text-xl font-bold tracking-tighter">def_math</div>
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-black transition-colors">Features</a>
              <a href="#" className="hover:text-black transition-colors">Pricing</a>
              <a href="#" className="hover:text-black transition-colors">About</a>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Footer */}
        <footer className="w-full border-t border-gray-200/50 bg-white py-8">
          <div className="mx-auto max-w-5xl px-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} def_math. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
