import PocketBase from "pocketbase";

const client = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://back.buyur.yurtal.tech"
);

export default client;
