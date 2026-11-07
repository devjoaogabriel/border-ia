import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Border-IA | Acelere sua criação de interfaces no Figma",
  description:
    "Plugin de Figma com inteligência artificial para remover fundos, gerar textos, ampliar imagens e criar avatares em tempo recorde.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={spaceGrotesk.variable}>
      <body className="bg-gray-11 font-sans text-gray-01 antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
