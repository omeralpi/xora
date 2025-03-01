import { Toaster } from "@/components/ui/sonner";
import { CryptoProvider } from "@/contexts/crypto-context";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from './trpc-provider';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Xora',
    default: 'Xora',
  },
  description: 'Welcome to our Decentralized Twitter Clone built with Chopin Framework and Celestia!',
  metadataBase: new URL('https://xora.social'),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Toaster />
        <TRPCProvider>
          <CryptoProvider>
            {children}
          </CryptoProvider>
        </TRPCProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
