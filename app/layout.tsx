import { Lato } from "next/font/google";
import "@styles/globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/components/providers/AuthProvider";
import { Metadata } from "next";
import Footer from "@/components/shared/footer/Footer";

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "M-Motors - Achat et Location de Véhicules",
  description:
    "Découvrez notre gamme de véhicules d\'occasion en excellent état. Achat et location longue durée (LLD).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <Toaster position="top-right" richColors closeButton />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
