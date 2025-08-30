'use client'

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Truck, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Cars", href: "/cars", icon: <Home size={20} /> },
    { label: "Loads", href: "/loads", icon: <Truck size={20} /> },
  ];

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer z-50 rounded-md"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {open && (
          <>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
 
            <motion.div
              initial={{ x: -200 }}
              animate={{ x: 0 }}
              exit={{ x: -200 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-screen w-[200px] bg-white shadow-md flex flex-col p-4 z-50"
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <button onClick={() => setOpen(false)} className="cursor-pointer">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition ${active ? "bg-gray-200 font-semibold" : ""
                        }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
