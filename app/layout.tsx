import type { Metadata } from "next";
import { Providers } from "@components/Providers";
import "@styles";

export const metadata: Metadata = {
  title: "Ariane World Builder",
  description: "Toolbox for world building",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
