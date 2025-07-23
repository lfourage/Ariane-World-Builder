import type { Metadata } from "next";
import { Providers } from "@components/wrapper/Providers";
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
