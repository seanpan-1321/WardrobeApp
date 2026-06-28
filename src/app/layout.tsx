import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WardrobeProvider } from "@/lib/wardrobe-context";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wardrobe App",
  description: "Upload your clothes and build outfits from what you own.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WardrobeProvider>
          <NavBar />
          {children}
        </WardrobeProvider>
      </body>
    </html>
  );
}
