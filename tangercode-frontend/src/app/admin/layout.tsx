import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { inter, jetbrainsMono, cairo } from "../fonts";
import { ThemeDataAttribute } from "@/components/layout/ThemeDataAttribute";
import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import "../tangercode.css";

export const metadata: Metadata = {
  title: "Admin — TANGER CODE",
  description: "Espace d'administration TANGER CODE",
  robots: "noindex, nofollow",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${cairo.variable}`}
    >
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@500,700,800&display=swap"
          rel="stylesheet"
        />
        <ThemeDataAttribute />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
