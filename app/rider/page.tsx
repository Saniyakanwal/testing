"use client";

import React, { useState } from 'react';
import { Mic, Send, CheckCircle } from 'lucide-react';

export default function Rider() {
  const [items, setItems] = useState([{ name: "Sugar (1kg)", price: "Pending" }]);
  const [val, setVal] = useState("");

  const updatePrice = async (text: string) => {
    await fetch("https://voice-ai-bot-theta.vercel.app/api/ai-processor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: text, role: 'rider' })
    });
    setItems(items.map(it => it.price === "Pending" ? { ...it, price: text } : it));
    setVal("");
  };

  return (
    <div className="min-h-screen bg-white text-green-800 p-8 font-sans">
      <h1 className="text-xl font-black italic text-green-600 mb-10 tracking-tight">RIDER ORDERS</h1>
      
      <div className="space-y-4 mb-20">
        {items.map((it, i) => (
          <div key={i} className="border-2 border-green-50 p-6 rounded-3xl flex justify-between items-center shadow-sm">
            <div>
               <p className="text-[10px] font-bold text-green-300 uppercase">Item</p>
               <span className="font-black text-lg">{it.name}</span>
            </div>
            <span className={it.price === "Pending" ? "text-orange-500 animate-pulse font-bold" : "text-green-600 font-black italic"}>{it.price}</span>
          </div>
        ))}
      </div>

      <div className="fixed bottom-10 left-6 right-6 flex gap-2">
        <input 
          value={val} 
          onChange={(e) => setVal(e.target.value)} 
          placeholder="Type price or use mic..." 
          className="flex-1 bg-green-50 rounded-full px-6 outline-none text-sm font-bold border border-green-100"
        />
        <button onClick={() => updatePrice(val)} className="bg-green-600 p-5 rounded-full text-white shadow-lg"><Mic size={20}/></button>
      </div>
    </div>
  );
}