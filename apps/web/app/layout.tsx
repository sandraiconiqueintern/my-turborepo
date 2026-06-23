import type { Metadata } from "next";
import { Voltaire, Patrick_Hand } from "next/font/google";
import "./globals.css";

const voltaire = Voltaire({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-voltaire",
});

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick-hand",
});

export const metadata: Metadata = {
  title: "To Do Lists",
  description: "A simple todo list app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${voltaire.variable} ${patrickHand.variable}`}>
        {children}
      </body>
    </html>
  );
}
