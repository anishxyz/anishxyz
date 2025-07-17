import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://anish.xyz'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Anish Agrawal',
    template: '%s > Anish Agrawal'
  },
  description: 'I like to build things.'
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8">
          <main className="max-w-[80ch] mx-auto w-full space-y-6 pt-12">
            {children}
          </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
