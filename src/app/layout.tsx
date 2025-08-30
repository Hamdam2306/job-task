"use client";
import "./globals.css";
import Sidebar from "@/components/app-sidebar";
import { usePathname } from "next/navigation";
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebar = pathname.startsWith("/auth");

  return (
    <html lang="en">
      <body className="flex">
        {!hideSidebar && <Sidebar />}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
