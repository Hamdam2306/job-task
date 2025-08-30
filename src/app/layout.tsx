"use client";
import "./globals.css";
import Sidebar from "@/components/app-sidebar";
import { AuthProvider } from "@/context/authContext";
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
        <AuthProvider>
          {!hideSidebar }
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
