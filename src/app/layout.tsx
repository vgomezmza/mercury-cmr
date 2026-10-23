import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mercury Creation & Design | CRM Omnicanal",
  description: "CRM inteligente local para servicios de UX/UI, Desarrollo Web, Software, Ads y Mantenimiento.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark h-full">
      <body className="min-h-screen bg-[#050813] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
