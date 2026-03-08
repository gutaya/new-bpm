import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "BPM USNI - Badan Penjaminan Mutu",
  description: "Badan Penjaminan Mutu Universitas Satya Negara Indonesia - Menggenggam Mutu, Meningkatkan Daya Saing",
  keywords: ["BPM", "USNI", "Penjaminan Mutu", "Akreditasi", "Universitas", "Pendidikan Tinggi", "Jakarta"],
  authors: [{ name: "USNI" }],
  icons: {
    icon: "https://usni.ac.id/images/favicon.png",
  },
  openGraph: {
    title: "BPM USNI - Badan Penjaminan Mutu",
    description: "Badan Penjaminan Mutu Universitas Satya Negara Indonesia - Menggenggam Mutu, Meningkatkan Daya Saing",
    url: "https://bpm.usni.ac.id",
    siteName: "BPM USNI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BPM USNI - Badan Penjaminan Mutu",
    description: "Badan Penjaminan Mutu Universitas Satya Negara Indonesia - Menggenggam Mutu, Meningkatkan Daya Saing",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
