import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TabNews — Em construção",
  description:
    "Estamos nesse exato momento reconstruindo o TabNews, um lugar na internet para quem trabalha com tecnologia e precisa comsumir conteúdos com valor concreto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
