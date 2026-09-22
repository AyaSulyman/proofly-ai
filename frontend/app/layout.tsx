import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Proofly AI — Trust more. Risk less.",
  description:
    "Investigate unfamiliar sellers, businesses, and websites before you trust them. AI-powered evidence analysis and transparent risk scoring.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="min-h-full bg-bg text-navy-700 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
