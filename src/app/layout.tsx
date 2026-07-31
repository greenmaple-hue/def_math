import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
        <Header />

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
