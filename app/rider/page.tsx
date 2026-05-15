"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Send, Bike, CheckCircle2, MessageSquare } from 'lucide-react';

export default function RiderSimplePage() {
  const [order, setOrder] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('active_order');
    if (data) setOrder(JSON.parse(data));
  }, []);

  const startVoice = () => {
    const Speech = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!Speech) return alert("Mic not supported");

    const rec = new Speech();
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => setReply(e.results[0][0].transcript);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const finalizeOrder = () => {
    alert(`Order Finalized! Reply sent: ${reply}`);
    // Yahan order khatam ho jayega
    localStorage.removeItem('active_order');
    setOrder(null);
  };

  if (!order) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-green-600 font-bold">
      <Bike size={48} className="mb-4 opacity-20" />
      <p>No new orders to show.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-green-800 p-6 font-sans flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 mb-10 border-b border-green-50 pb-4">
        <h1 className="text-2xl font-black italic tracking-tighter text-green-600">RIDER SYNC</h1>
      </header>

      {/* 1. Customer Ki Taraf Se Aaya Hua Order */}
      <div className="bg-green-50/50 border-2 border-green-100 rounded-[2.5rem] p-6 mb-6">
        <p className="text-[10px] font-black text-green-400 uppercase mb-4 tracking-widest">Order from Customer</p>
        <h2 className="text-xl font-black mb-4">{order.shop}</h2>
        <div className="space-y-2">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between font-bold text-sm">
              <span>• {item.name}</span>
              <span className="italic opacity-60">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Rider Ka Reply Area */}
      <div className="flex-1 flex flex-col justify-end pb-10">
        <div className="mb-6">
          <label className="text-[10px] font-black text-green-400 uppercase ml-4 mb-2 block">Your Response (Voice/Type)</label>
          <div className="bg-white border-2 border-green-100 rounded-3xl p-4 min-h-[100px] shadow-inner relative">
            <p className="text-green-800 font-medium">
              {reply || <span className="text-green-200 italic">Reply sunay ya likhain...</span>}
            </p>
            <MessageSquare className="absolute bottom-4 right-4 text-green-100" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <input 
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type reply..."
            className="col-span-3 bg-green-50 border border-green-100 rounded-2xl px-4 outline-none font-bold text-sm"
          />
          <button 
            onClick={startVoice}
            className={`col-span-1 p-4 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-green-100 text-green-600'}`}
          >
            <Mic size={20} />
          </button>
          <button 
            onClick={() => setReply("")}
            className="col-span-1 p-4 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400"
          >
            <Send size={20} className="rotate-45" />
          </button>
        </div>

        <button 
          onClick={finalizeOrder}
          className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-green-100 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
        >
          <CheckCircle2 size={20} /> Finalize & Send
        </button>
      </div>
    </div>
  );
}