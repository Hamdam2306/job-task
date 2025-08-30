import PocketBase from "pocketbase";

// PocketBase server URL
const client = new PocketBase("https://back.buyur.yurtal.tech");

// Tokenni localStorage’dan o‘qish (faqat browserda)
if (typeof window !== "undefined") {
  const token = localStorage.getItem("pb_auth");
  if (token) {
    client.authStore.save(token, null);
  }
}

export default client;
