import type { Metadata } from "next";
import { Providers } from "@components/Providers";
import "@app/styles/globals.css";

export const metadata: Metadata = {
  title: "Ariane World Builder",
  description: "Toolbox for world building",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/BobinIcon.svg", type: "image/svg+xml" },
      { url: "/BobinIcon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/BobinIcon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
