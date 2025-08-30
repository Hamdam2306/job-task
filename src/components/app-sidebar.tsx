'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Truck } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { label: "Cars", href: "/cars", icon: <Home size={20} /> },
    { label: "Loads", href: "/loads", icon: <Truck size={20} /> },
  ];

  return (
    <div className="h-screen w-60 bg-white shadow-md flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition ${
                active ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
