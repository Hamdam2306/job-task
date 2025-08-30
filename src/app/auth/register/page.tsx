"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PocketBase from 'pocketbase';
import { Button } from "@/components/ui/button";
import Link from "next/link";

const client = new PocketBase('https://back.buyur.yurtal.tech');

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
      setError("Passwords do not match.");
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

      console.log("Successfully registered and logged in!");
      console.log("Saved token:", client.authStore.token);

      router.push("/cars");
    } catch (err: unknown) {
      console.error("Error during registration:", err);

      if (err instanceof Error) {
        setError(err.message || "An unknown error occurred.");
      } else {
        setError("An unknown error occurred.");
      }
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

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gray-900 text-white p-3 rounded disabled:bg-blue-300 hover:bg-gray-800 transition-colors"
          >
            {isLoading ? "loading..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Do not have an account?{" "}
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