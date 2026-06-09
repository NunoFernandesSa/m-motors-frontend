import { Geist } from "next/font/google";
import "@styles/globals.css";
import Footer from "@/components/shared/footer/Footer";
import { Toaster } from "sonner";
import AuthProvider from "@/components/providers/AuthProvider";
import { Metadata } from "next";
import Navbar from "@/components/shared/navbar/Navbar";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "M-Motors",
  description: "...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <Toaster position="top-right" richColors closeButton />
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
