// src/app/page.tsx
'use client'
import { useAuth } from "@/context/authContext";
import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
   const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading){
      if (user) {
        router.push('/cars')
      } else {
        router.push('/auth/login')
      }
    }
  }, [user, loading, router])


  return (
   <div className="flex justify-center mt-10">
     <Loader2 className="animate-spin h-5 w-5 mr-3" />
   </div>
  );
}
