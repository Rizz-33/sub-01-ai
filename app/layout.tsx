import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "MotivAI",
  description: "Motivational Quote Generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex items-center justify-center p-4">{children}</div>
        </Providers>
      </body>
    </html>
  );
}


