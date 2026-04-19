import type { Metadata } from "next";
import { Inter, Roboto_Mono, Fira_Code, Lexend } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Typebyte | Premium Typing Platform",
  description: "Minimalist, customizable typing test experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} ${firaCode.variable} ${lexend.variable} h-full antialiased`}
      data-theme="keyzen"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
