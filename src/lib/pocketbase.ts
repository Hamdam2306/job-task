import PocketBase from "pocketbase";

const client = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URLm || "http://back.buyur.yurtal.tech");


if (typeof window !== "undefined") {
  const token = localStorage.getItem("pb_auth");
  if (token) {
    client.authStore.save(token, null);
  }
}

export default client;
