import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "DareMe — Drop a dare. Take the challenge.",
  description:
    "A simple Web3 challenge dApp on Botchain Testnet. Drop a dare, take the challenge, and prove yourself.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-charcoal-950 text-gray-100 antialiased selection:bg-purple-900/40 selection:text-purple-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

