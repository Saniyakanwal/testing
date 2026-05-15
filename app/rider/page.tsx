"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Bike, CheckCircle2, MessageSquare, RefreshCw, Trash2 } from 'lucide-react';

export default function RiderPage() {
  const [order, setOrder] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Function to sync data from LocalStorage
  const syncOrder = () => {
    const data = localStorage.getItem('latestOrder');
    if (data) {
      setOrder(JSON.parse(data));
    } else {
      setOrder(null);
    }
  };

  useEffect(() => {
    syncOrder();
    // Har 2 second baad check karega ke customer ne order bheja ya nahi
    const interval = setInterval(syncOrder, 2000);
    return () => clearInterval(interval);
  }, []);

  // Voice Recognition Logic
  const startVoice = () => {
    const Speech = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!Speech) return alert("Browser mic support nahi kar raha");

    const rec = new Speech();
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => {
      setReply(e.results[0][0].transcript);
    };
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const finalizeOrder = () => {
    if (!reply) return alert("Pehle koi reply likhain ya bolain!");
    
    alert(`Order Finalized! Customer ko reply chala gaya: ${reply}`);
    localStorage.removeItem('active_order'); // Order khatam
    setOrder(null);
    setReply("");
  };

  if (!order) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-green-600">
      <RefreshCw className="animate-spin mb-4 text-green-300" size={32} />
      <p className="font-black italic uppercase tracking-widest text-sm">Waiting for Customer...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-green-800 p-6 font-sans flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 mb-8 border-b border-green-50 pb-4">
        <div className="bg-green-600 p-2 rounded-xl text-white">
          <Bike size={24} />
        </div>
        <h1 className="text-xl font-black italic tracking-tight">RIDER DASHBOARD</h1>
      </header>

      {/* Received Order Details */}
      <div className="bg-green-50/50 border-2 border-green-100 rounded-[2.5rem] p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Incoming from</p>
            <h2 className="text-2xl font-black text-green-900">{order.shop}</h2>
          </div>
          <button onClick={() => {localStorage.removeItem('active_order'); setOrder(null);}} className="text-red-300 hover:text-red-500">
            <Trash2 size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {order.items.map((it: any, i: number) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-green-100 last:border-0">
              <span className="font-bold text-sm text-green-800 tracking-tight">{it.name}</span>
              <span className="text-xs font-black italic text-green-600 bg-white px-3 py-1 rounded-full border border-green-50">
                {it.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rider Response Section */}
      <div className="flex-1 flex flex-col justify-end pb-6">
        <label className="text-[10px] font-black text-green-400 uppercase ml-4 mb-2 block tracking-widest">
          Your Voice/Type Reply
        </label>
        
        <div className="relative mb-6">
          <textarea 
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Order ke baaray mein bataein..."
            className="w-full bg-white border-2 border-green-100 rounded-[2rem] p-6 outline-none font-bold text-green-800 h-32 shadow-inner placeholder:text-green-100"
          />
          <MessageSquare className="absolute bottom-6 right-6 text-green-50" />
        </div>

        {/* Voice & Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button 
            onClick={startVoice}
            className={`flex-1 p-5 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-green-100 text-green-600'}`}
          >
            <Mic size={20} /> {isListening ? "Listening..." : "Voice Reply"}
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