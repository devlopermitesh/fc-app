import type { Metadata } from "next";
import ModalProvider from "@/components/Providers/ModalProvider";
import SocketProvider from "@/components/Providers/socketProvider";
import ToastProvider from "@/components/Providers/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fantasy Chat",
  description: "Match your fantasy with a cinematic, anonymous experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans text-foreground">
        <SocketProvider>
          <ToastProvider>
            {children}
            <ModalProvider />
          </ToastProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
