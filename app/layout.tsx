import type { Metadata } from "next";
import { Inter,Josefin_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
const inter = Inter({ subsets: ["latin"] });
const josefinSans = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tenders App",
  description: "Tenders app dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={josefinSans.className}>{children}</body>
    </html>
  );
}
