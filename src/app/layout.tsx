import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"], // 500を削除してフォント読み込みを軽量化
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "smartsample - オフィス用品・事務用品通販",
  description: "オフィス用品、文具、家具、電化製品を取り扱うECサイト。3,000円以上で送料無料。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization 構造化データ
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'smartsample',
    url: 'https://smartsample.example.com',
    logo: 'https://smartsample.example.com/img/header_logo.png',
    description: 'オフィス用品、文具、家具、電化製品を取り扱うECサイト',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Japanese'],
    },
  };

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        {/* Organization 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1f2937',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            className: '',
          }}
          containerStyle={{
            bottom: 20,
            right: 20,
          }}
        />
      </body>
    </html>
  );
}
