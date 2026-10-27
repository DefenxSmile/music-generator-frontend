import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { Providers } from "@/components/shell/providers";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#08080a", // same value as --color-bg; the browser chrome cannot read a CSS variable
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "AI Music",
  description: "Опишите идею и получите песню с музыкой и русским вокалом.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
