import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const image = `${protocol}://${host}/og.png`;
  return {
    title: {
      default: "Berlin-Akte 2040",
      template: "%s · Berlin-Akte 2040",
    },
    description:
      "Kollaborativer historischer Ermittlungsparcours durch fünf Epochen Berlins.",
    applicationName: "Berlin-Akte 2040",
    openGraph: {
      title: "Berlin-Akte 2040",
      description: "Die Geschichte ist beschädigt. Repariert fünf Berlin-Akten mit Quellen und Karten.",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: "Berlin-Akte 2040 – Die Geschichte ist beschädigt." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Berlin-Akte 2040",
      description: "Kollaborativer historischer Ermittlungsparcours durch fünf Epochen.",
      images: [image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
