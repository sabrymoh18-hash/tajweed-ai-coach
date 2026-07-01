import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "محراب الصوت | مدرب التجويد الذكي",
  description: "تقنية الذكاء الاصطناعي تُصحح مخارج حروفك وتُطوّر تنفسك في التلاوة بدقة فسيولوجية.",
  openGraph: {
    title: "محراب الصوت — Tajweed AI Coach",
    description: "تدريب التجويد بالذكاء الاصطناعي وتحليل الصوت الحقيقي",
    type: "website",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* PWA Support */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2a7a4e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="محراب الصوت" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

