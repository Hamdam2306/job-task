import PocketBase from "pocketbase";

const client = new PocketBase("https://back.buyur.yurtal.tech");


if (typeof window !== "undefined") {
  const token = localStorage.getItem("pb_auth");
  if (token) {
    client.authStore.save(token, null);
  }
}

export default client;
