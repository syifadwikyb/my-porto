import type { Metadata } from "next";
// 1. Import font dari Google
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// 2. Konfigurasi font
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], // Pilih ketebalan yang mau dipakai
  variable: "--font-jakarta", // Opsional: untuk variabel CSS
});

export const metadata: Metadata = {
  title: "Dwikyb",
  description: "Portofolio Syifa Dwiky Basamala",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* 3. Terapkan class font ke body */}
      <body className={`${jakarta.className} bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}