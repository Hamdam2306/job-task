"use client";
import client from "@/lib/pocketbase";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

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
    <nav className="p-4 flex justify-end items-center">
      <div className="mb-4 flex justify-end space-x-2">
        {isauth ? (
          <Button variant="outline" onClick={logout}>
            Chiqish
          </Button>
        ) : (
          <>
           <Link href={"/auth/login"}>
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href={"/auth/register"}>
              <Button>Register</Button>
           </Link>
          </>
        )}
      </div>
    </nav>
  );
}
