"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import echo from "@/lib/echo";
import { Phone, Video, Paperclip, Send } from "lucide-react";

const Communication = () => {

  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const user = "Admin";

  const contacts = [
    { name: "Rajesh Kumart", role: "JE", initial: "J", status: "online" },
    { name: "Priya Sharma", role: "AE", initial: "A", status: "online"},
    { name: "Dr. Amit Verma", role: "EE", initial: "E", status: "away" },
    { name: "ABC Constructions...", role: "Contractor", initial: "C", status: "online" },
  ];

  useEffect(() => {

    loadMessages();

    const channel = echo.channel("chat")
      .listen("MessageSent", (e) => {
        setLogs(prev => [...prev, e.message]);
      });

    return () => {
      echo.leaveChannel("chat");
    };

  }, []);

  const loadMessages = async () => {
    try {

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/messages`
      );

      setLogs(res.data);

    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async () => {

    if (!message.trim()) return;

    try {
      console.log('rrr')

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/send-message`,
        {
          user: user,
          message: message
        }
      );

      setMessage("");

    } catch (error) {
      console.error("Message send failed:", error);
    }
  };

  return (
    <div className="flex gap-4 h-[500px] font-sans">

      {/* LEFT CONTACTS */}
      <div className="w-1/3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Project Contacts</h2>

        <div className="space-y-2">
          {contacts.map((contact, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100">

              <div className="flex items-center gap-3">

                <div className="relative w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {contact.initial}

                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    contact.status === "online"
                      ? "bg-green-500"
                      : "bg-orange-400"
                  }`}></span>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {contact.role}
                  </p>
                </div>

              </div>

              <div className="flex gap-2 text-gray-500">
                <Phone size={18} />
                <Video size={18} />
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT */}
      <div className="flex-1 h-[100vh] bg-white rounded-2xl border border-gray-100 flex flex-col shadow-sm">

        {/* HEADER */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">
            Communication Log
          </h2>

          <span className="text-xs text-gray-400 border px-2 py-1 rounded-full">
            {logs.length} messages
          </span>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {logs.map((log, i) => (

            <div key={i} className="flex gap-4">

              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                {log.user?.charAt(0)}
              </div>

              <div>

                <span className="text-sm font-bold text-gray-800">
                  {log.user}
                </span>

                <p className="text-sm text-gray-600 mt-1">
                  {log.message}
                </p>

              </div>

            </div>

          ))}

        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-gray-100 flex items-center gap-3">

          <button className="p-2.5 bg-gray-50 border rounded-lg">
            <Paperclip size={20} />
          </button>

          <input
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key === "Enter"){
                sendMessage();
              }
            }}
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none"
          />

          <button
            onClick={sendMessage}
            className="p-2.5 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            <Send size={18}/>
          </button>

        </div>

      </div>
    </div>
  );
};

export default Communication;