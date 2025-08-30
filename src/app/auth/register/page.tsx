"use client";
// src/app/auth/register/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import client from '@/lib/pocketbase';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== passwordConfirm) {
      setError("Parollar mos kelmadi.");
      setIsLoading(false);
      return;
    }

    try {
      const data = {
        username: username,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        emailVisibility: true,
      };

      await client.collection("users").create(data);
      await client.collection("users").authWithPassword(email, password);

      console.log("Ro'yxatdan o'tish muvaffaqiyatli!");
      console.log("Foydalanuvchi:", client.authStore.record);
      console.log("Token:", client.authStore.token);
      console.log("User ID:", client.authStore.model?.id);

      // Foydalanuvchi muvaffaqiyatli kirgandan so'ng, /cars sahifasiga o'tish
      router.push("/cars");
    } catch (err: any) {
      console.error("Ro'yxatdan o'tishda xatolik:", err);
      const errorMessage = err.response?.message || "Noma'lum xatolik yuz berdi.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4 w-full max-w-md">
        {/* <Link href={"/cars"}>
          <Button variant="link">
              <span className="flex items-center"><ArrowLeft/> back</span>
            </Button>
        </Link> */}

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

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gray-900 text-white p-3 rounded disabled:bg-blue-300 hover:bg-gray-800 transition-colors"
          >
            {isLoading ? "loading..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Do you have an account?{" "}
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