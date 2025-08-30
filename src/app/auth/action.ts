"use server";

import client from "@/lib/pocketbase";

type AuthData = {
  username?: string;
  email: string;
  password: string;
  passwordConfirm?: string;
};

export async function authUser(mode: "register" | "login", data: AuthData) {
  try {
    let user;
    if (mode === "register") {
      user = await client.collection("users").create({
        username: data.username,
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });
      await client.collection("users").authWithPassword(data.email, data.password);
    }
    if (mode === "login") {
      user = await client.collection("users").authWithPassword(data.email, data.password);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("pb_auth", client.authStore.token);
    }
    return user;
  } catch (err: any) {
    console.error("Auth error:", err);
    throw err;
  }
}