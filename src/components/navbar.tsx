"use client";
import client from "@/lib/pocketbase";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Sidebar from "./app-sidebar";

export default function Navbar() {
  const [isauth, setIsauth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsauth(client.authStore.isValid);
    return client.authStore.onChange(() => {
      setIsauth(client.authStore.isValid);
    });
  }, []);

  const logout = useCallback(() => {
    client.authStore.clear();
    router.push("/auth/login");
    setIsauth(false);
  }, []);


  return (
    <nav className="p-0 flex items-center">
      <div className="mb-4 w-full">
        {isauth ? (
          <div className="flex items-center justify-between w-full">
            <Sidebar />
            <Button variant="default" onClick={logout} className="ml-4 text-[10px]">
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex gap-4 justify-end w-full">
            <Link href={"/auth/login"}>
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href={"/auth/register"}>
              <Button>Register</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
