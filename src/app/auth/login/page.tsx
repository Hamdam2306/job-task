"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClientResponseError } from "pocketbase";

const client = new PocketBase("http://back.buyur.yurtal.tech");

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await client.collection("users").authWithPassword(email, password);
      router.push("/cars");
    } catch (err: unknown) {
      if (err instanceof ClientResponseError) {
        if (err.status === 400) {
          setError("Invalid email or password.");
        } else {
          setError(err.message || "Something went wrong.");
        }
      } else if (err instanceof Error) {
        setError(err.message || "Something went wrong.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br p-4">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link href={"/cars"}>
          <Button variant="link">back</Button>
        </Link>


        <Card className="w-full max-w-md shadow-lg rounded-2xl border ">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold ">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border p-5 rounded"
                />
              </div>

              <div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border p-5 rounded"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-sm p-6"
              >
                {isLoading ? `Please wait...` : `Login`}
              </Button>

              <p className="text-center text-sm text-gray-600 mt-3">
                Do not have an account?{" "}
                <a
                  href="/auth/register"
                  className=" font-medium hover:underline"
                >
                  Sign up
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}
