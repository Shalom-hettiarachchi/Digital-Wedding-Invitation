import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emma & James — We're Getting Married",
  description: "Join us as we celebrate the wedding of Emma & James on June 18, 2027.",
};

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&family=Pinyon+Script&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_URL} />
      </head>
      <body className="bg-paper text-ink font-sans font-light antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
