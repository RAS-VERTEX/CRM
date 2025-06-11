import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SimPRO Photo Grid CRM",
  description: "Enterprise photo grid report builder with SimPRO integration",
  keywords: ["SimPRO", "CRM", "Photo Grid", "Report Builder", "Enterprise"],
  authors: [{ name: "Your Company" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </body>
    </html>
  );
}
