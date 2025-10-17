import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/providers";
import Header from "@/modules/header";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Quote Generator",
  description:
    "Generate and mint unique AI-powered quotes on the blockchain. Connect your wallet, create inspiring content, and own your words forever.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <Providers>
          <div className="font-sans">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
