import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import PageTransition from "@/components/ui/PageTransition";
import Menu from "@/components/ui/Menu";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";

const clash = localFont({
  src: "../fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  display: "swap",
});

const syne = Syne({ variable: "--font-syne", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DicomForge - DICOM to 3D STL",
  description: "Convert DICOM medical imaging into accurate 3D STL models.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${clash.variable} ${syne.variable} ${spaceGrotesk.variable}`}>
        <SmoothScroll>
          <PageTransition>
            {children}
            <Menu />
          </PageTransition>
        </SmoothScroll>
        <CustomCursor />
      </body>
    </html>
  );
}
