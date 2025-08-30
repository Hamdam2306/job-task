"use client"; // Bu komponent faqat brauzerda ishlashini bildiradi

import { useState } from "react";
import { useRouter } from "next/navigation";
import PocketBase from 'pocketbase'; // PocketBase'ni import qilamiz
import { Button } from "@/components/ui/button";
import Link from "next/link";

// PocketBase client'ni shu yerda yaratamiz.
// O'z hosting manzilingizni yozing.
const client = new PocketBase('http://back.buyur.yurtal.tech');

export default function RegisterPage() {
  const router = useRouter();

  // Form maydonlari uchun state'lar
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Yuklanish va xatolik holatlari uchun state'lar
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Sahifa yangilanishining oldini olish
    setIsLoading(true);
    setError("");

    // 1. Parollar mosligini tekshirish
    if (password !== passwordConfirm) {
      setError("Parollar bir-biriga mos kelmadi.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Yangi foydalanuvchini yaratish uchun ma'lumotlarni tayyorlash
      const data = {
        username: username,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        emailVisibility: true, // PocketBase talab qilishi mumkin
      };

      // 3. PocketBase'ga yangi foydalanuvchi yaratish uchun so'rov yuborish
      await client.collection('users').create(data);

      // 4. Foydalanuvchi yaratilgandan so'ng, tizimga kirish (login qilish)
      // Bu qadam access token'ni olish uchun kerak
      await client.collection('users').authWithPassword(email, password);

      // Muvaffaqiyatli kirilgandan so'ng PocketBase JS SDK avtomatik tarzda
      // token'ni 'localStorage'ga saqlaydi. Biz hech narsa qilishimiz shart emas.

      console.log("Muvaffaqiyatli ro'yxatdan o'tildi va tizimga kirildi!");
      console.log("Saqlangan token:", client.authStore.token);

      // 5. Foydalanuvchini boshqa sahifaga yo'naltirish
      router.push("/cars"); // Masalan, asosiy sahifaga

    } catch (err: any) {
      console.error("Ro'yxatdan o'tishda xatolik:", err);
      // PocketBase'dan kelgan xatolik xabarini ko'rsatish
      setError(err.message || "Noma'lum xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link href={"/cars"}>
          <Button variant="link">back</Button>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-8 bg-white shadow-md border rounded-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-3 rounded"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded"
            required
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded"
            required
          />

          <input
            type="password"
            placeholder="confirm password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="border p-3 rounded"
            required
          />

          {/* Xatolik xabarini ko'rsatish bloki */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gray-900 text-white p-3 rounded disabled:bg-blue-300 hover:bg-gray-800 transition-colors"
          >
            {isLoading ? "loading..." : "Register"}
          </button>

           <p className="text-center text-sm text-gray-600 mt-3">
              Don't have an account?{" "}
              <a
                href="/auth/login"
                className=" font-medium hover:underline"
              >
                Login
              </a>
            </p>
        </form>
      </div>
    </div>
  );
}