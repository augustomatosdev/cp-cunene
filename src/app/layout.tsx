import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "@/lib/session-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Gestão de Fornecedores - Governo Provincial do Cunene",
  description:
    "Gerencie fornecedores de forma eficiente para o Governo Provincial do Cunene com nosso aplicativo abrangente. Simplifique a integração de fornecedores, gestão de dados e comunicação.",
  keywords: [
    "Gestão de Fornecedores",
    "Governo Provincial do Cunene",
    "Integração de Fornecedores",
    "Compras Governamentais",
    "Sistema de Gestão",
  ],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
