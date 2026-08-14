import type { Metadata } from "next";
import { Outfit, Source_Serif_4 } from "next/font/google";
import Header from "@/components/Header";
import SkipLink from "@/components/SkipLink";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WEXO Movies",
    template: "%s | WEXO Movies",
  },
  description:
    "Browse popular movies by genre using The Movie Database (TMDB) API.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${sourceSerif.variable}`}>
      <body>
        <SkipLink />
        <Header />
        <main id="main-content" className="main">
          {children}
        </main>
      </body>
    </html>
  );
}
