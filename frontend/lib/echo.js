"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

Pusher.logToConsole = true;   // 👈 write here

if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

const echo = new Echo({
  broadcaster: "pusher",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  forceTLS: false,

  // ✅ Correct endpoint
  authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth",

  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Accept: "application/json",
    },
  },

  enabledTransports: ["ws", "wss"],
});

export default echo;