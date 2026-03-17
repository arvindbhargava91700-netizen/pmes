import React from "react";
import { Phone, Video, Paperclip, Send, PhoneIncoming } from "lucide-react";

const Communication = () => {
  const contacts = [
    { name: "Rajesh Kumar", role: "JE", initial: "J", status: "online" },
    { name: "Priya Sharma", role: "AE", initial: "A", status: "online"},
    { name: "Dr. Amit Verma", role: "EE", initial: "E", status: "away" },
    { name: "ABC Constructions...", role: "Contractor", initial: "C", status: "online" },
  ];

  const logs = [
    { user: "Rajesh Kumar (JE)", time: "2 hours ago", msg: "Drainage work progressing well. Material supply on schedule.", initial: "JE" },
    { type: "call", user: "ABC Constructions", time: "Yesterday", msg: "Discussed manpower deployment for next phase.", duration: "12 min" },
    { user: "Priya Sharma (AE)", time: "Yesterday", msg: "Quality inspection scheduled for tomorrow at 10 AM.", initial: "AE" },
    { user: "System", time: "2 days ago", msg: "Bill BILL-004 submitted for review.", initial: "S" },
    { type: "call", user: "Dr. Amit Verma (EE)", time: "3 days ago", msg: "Site visit completed. Minor adjustments required in drainage alignment.", duration: "25 min" },
  ];

  return (
    <div className="flex gap-4 h-[500px] font-sans">
      {/* LEFT: Project Contacts */}
      <div className="w-1/3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Project Contacts</h2>
        <div className="space-y-2">
          {contacts.map((contact, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                contact.active ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {contact.initial}
                  <span className={`absolute bottom-0 mt-5 right-0 w-3 h-3 rounded-full ${
                    contact.status === "online" ? "bg-green-500" : "bg-orange-400"
                  }`}></span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{contact.name}</p>
                  <p className="text-xs text-gray-400">{contact.role}</p>
                </div>
              </div>
              <div className="flex gap-2 text-gray-500">
                <Phone size={18} className="hover:text-blue-600" />
                <Video size={18} className="hover:text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Communication Log */}
      <div className="flex-1 h-[100vh] bg-white rounded-2xl border border-gray-100 flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Communication Log</h2>
          <span className="text-xs text-gray-400 border px-2 py-1 rounded-full">5 messages</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-4 h-20">
              <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold ${
                log.type === "call" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
              }`}>
                {log.type === "call" ? <PhoneIncoming size={18} /> : log.initial}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{log.user}</span>
                  <span className="text-xs text-gray-400">{log.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{log.msg}</p>
                {log.duration && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-500">
                    <Phone size={12} /> {log.duration}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 flex items-center gap-3">
          <button className="p-2.5 bg-gray-50 text-gray-600 border border-zinc-200 rounded-lg hover:bg-gray-100 hover:text-blue-500 cursor-pointer">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
          />
          <button className="p-2.5 px-4 cursor-pointer bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Communication;