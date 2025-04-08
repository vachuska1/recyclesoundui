import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "RecycleSound | Akustický detekční systém pro recyklaci",
    template: "%s | RecycleSound"
  },
  description: "Inovativní systém pro automatickou detekci a třídění recyklovatelných materiálů pomocí pokročilé akustické analýzy. Zvyšte efektivitu vaší recyklační linky.",
  keywords: [
    "recyklace",
    "třídění odpadu",
    "akustická detekce",
    "udržitelné technologie",
    "recyklační systém",
    "AI třídění odpadu"
  ],
  generator: "Next.js",
  applicationName: "RecycleSound",
  referrer: "origin-when-cross-origin",
  authors: [{ name: "Ing. Aleš Vachuška", url: "https://recyclesound.com" }],
  creator: "Váše společnost",
  publisher: "Váše společnost",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://recyclesound.com"),
  alternates: {
    canonical: "/",
    languages: {
      "cs-CZ": "/cs",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "RecycleSound | Revoluce v recyklaci materiálů",
    description: "Akustický detekční systém pro automatické třídění recyklovatelných materiálů",
    url: "https://recyclesound.com",
    siteName: "RecycleSound",
    images: [
      {
        url: "https://recyclesound.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RecycleSound systém v akci",
      },
    ],
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RecycleSound | Revoluce v recyklaci materiálů",
    description: "Akustický detekční systém pro automatické třídění recyklovatelných materiálů",
    images: ["https://recyclesound.com/og-image.jpg"],
    creator: "@recyclesound",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "vaše-google-verifikacni-kod",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "RecycleSound",
            "image": "https://recyclesound.com/og-image.jpg",
            "description": "Akustický detekční systém pro recyklační zařízení",
            "brand": {
              "@type": "Brand",
              "name": "RecycleSound"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "42"
            }
          })}
        </script>
      </head>
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}