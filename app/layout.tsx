import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@styles/globals.css";
import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "@/components/shared/footer/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M-Motors",
  description:
    "M-Motors : votre expert automobile pour l'achat ou la location longue durée de véhicules de qualité. Découvrez notre histoire et nos services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="top-right" richColors closeButton />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
