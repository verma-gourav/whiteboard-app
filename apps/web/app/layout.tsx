import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Whiteboard",
  description: "Collaborative whiteboard app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-hidden">
        {/* Dotted backgound */}
        <div className="-z-10 inset-0 h-full w-full">{children}</div>
      </body>
    </html>
  );
}
