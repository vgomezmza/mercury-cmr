import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mercury Creation and Design | CRM Omnicanal",
  description: "Agencia digital en Mendoza especializada en UX/UI, branding, desarrollo web y software a medida.",
  icons: {
    icon: "/brand/mercury-icon.png",
    shortcut: "/brand/mercury-icon.png",
    apple: "/brand/mercury-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${poppins.variable} ${roboto.variable} dark h-full`}>
      <body className="min-h-screen bg-[#030212] text-slate-100 font-sans antialiased selection:bg-[#375EFB] selection:text-white relative fondo-espacial">
        {children}
      </body>
    </html>
  );
}

