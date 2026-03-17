"use client";

import React, { useState, useEffect, useRef } from "react";
import echo from "@/lib/echo";
import {
  FiSearch,
  FiPhone,
  FiVideo,
  FiMoreVertical,
  FiPaperclip,
  FiImage,
  FiSend,
} from "react-icons/fi";
import api from "@/components/Api/privetApi";

const Communication = () => {
  const [role, setRole] = useState("chats");
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);


  
  const userId = 1; // logged in admin id
  const scrollRef = useRef(null);
  

  const contacts = [
    { id: 2, name: "Rajesh Kumar", initial: "RK" },
    { id: 3, name: "Priya Sharma", initial: "PS" },
    { id: 4, name: "Dr. Amit Verma", initial: "AV" },
    { id: 5, name: "ABC Constructions", initial: "AC" },
    { id: 6, name: "XYZ Infrastructure", initial: "XY" },
  ];

  /*
  =============================
  LOAD MESSAGES + REALTIME
  =============================
  */
useEffect(() => {
  if (!selectedUser) return;

  let channel;

  const loadMessages = async () => {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/public/api/master/messages/${selectedUser}`
      );

      setLogs(res.data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  loadMessages();

  channel = echo
    .private(`chat.${selectedUser}`)
    .listen(".message.sent", (e) => {
      const msg = e.message;

      setLogs((prev) => {
        const exists = prev.find((m) => m.id === msg.id);
        if (exists) return prev;

        return [...prev, msg];
      });
    });

  return () => {
    echo.leave(`chat.${selectedUser}`);
  };
}, [selectedUser]);
  /*
  =============================
  AUTO SCROLL
  =============================
  */

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  /*
  =============================
  SEND MESSAGE
  =============================
  */

  const sendMessage = async () => {
  if (!message.trim() || !selectedUser) return;

  const msgText = message;



  setMessage("");

  try {
    await api.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/public/api/master/send-message`,
      {
        receiver_id: selectedUser,
        message: msgText,
        type: "text",
      }
    );
  } catch (error) {
    console.error("Message send failed:", error);
  }
};

  return (
    <div className="h-screen mt-12 bg-gray-100 p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Communication
          </h1>
          <p className="text-sm text-gray-500">
            In-app calling, messaging, and collaboration
          </p>
        </div>
      </div>

      {role === "chats" && (
        <div className="bg-white rounded-xl shadow flex h-[85vh] overflow-hidden">
          {/* CONTACT LIST */}
          <div className="w-[35%] border-r border-gray-300 p-4">
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Search contacts..."
              />
            </div>

            <div className="space-y-3">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedUser(c.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                    selectedUser === c.id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600">
                    {c.initial}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500">Click to start chat</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 flex flex-col">
            {/* CHAT HEADER */}
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                  {selectedUser
                    ? contacts.find((c) => c.id === selectedUser)?.initial
                    : "?"}
                </div>

                <div>
                  <p className="font-medium">
                    {selectedUser
                      ? contacts.find((c) => c.id === selectedUser)?.name
                      : "Select User"}
                  </p>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
            </div>

            {/* MESSAGES */}
            <div
              ref={scrollRef}
              className="flex-1 p-6 space-y-4 bg-gray-50 overflow-y-auto"
            >
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 rounded-xl max-w-lg text-sm ${
                    log.sender_id === userId
                      ? "ml-auto bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {log.message}

                  <div className="text-xs mt-1 opacity-70">
                    {log.sender_id === userId
                      ? "You"
                      : contacts.find((c) => c.id === log.sender_id)?.name ||
                        "User"}
                  </div>
                </div>
              ))}
            </div>

            {/* MESSAGE INPUT */}
            <div className="p-4 border-t border-gray-300 flex gap-3">
              <FiPaperclip size={20} />
              <FiImage size={20} />

                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
                    placeholder="Type a message..."
                  />

              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center"
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;