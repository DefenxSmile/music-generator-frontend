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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("lp_sidebar_collapsed")==="1")document.documentElement.setAttribute("data-sidebar","collapsed")}catch(e){}',
          }}
        />
        {/* Similarweb rejects a second promise when refresh cannot reach Java, and the dev overlay treats it as a crash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("unhandledrejection",function(e){var r=e.reason;if(!r||r.name!=="TypeError"||r.message!=="Failed to fetch")return;var s=String(r.stack||"");if(s.indexOf("performRefresh")===-1&&s.indexOf("fetch-json")===-1)return;e.preventDefault();e.stopImmediatePropagation()})',
          }}
        />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
