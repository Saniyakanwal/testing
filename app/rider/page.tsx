"use client";

import React, { useState, useEffect } from 'react';
import { 
  Mic, Play, Bike, CheckCircle2, 
  Volume2, MessageSquare, RefreshCcw, 
  Trash2, ShoppingBag 
} from 'lucide-react';

export default function RiderPage() {
  const [order, setOrder] = useState<any>(null);
  const [activeMic, setActiveMic] = useState<number | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // 1. Load Order from LocalStorage
  const loadOrder = () => {
    const data = localStorage.getItem('latestOrder');
    if (data) {
      setOrder(JSON.parse(data));
    }
  };

  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 3000); // Auto-refresh every 3s
    return () => clearInterval(interval);
  }, []);

  // 2. Play Customer's Voice/Request
  const playRequest = (item: any) => {
    const message = item.isCustom ? `Customer requested: ${item.name}` : `Item is ${item.name} from ${item.shopName}`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // 3. Rider Voice Recognition (Per Item)
  const startRiderMic = (index: number) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Aapka browser voice support nahi karta. Please Chrome use karein.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => setActiveMic(index);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const updatedItems = [...order.items];
      updatedItems[index].riderReply = transcript; // Specific item ka reply save ho raha hai
      setOrder({ ...order, items: updatedItems });
    };

    recognition.onerror = () => setActiveMic(null);
    recognition.onend = () => setActiveMic(null);
    
    recognition.start();
  };

  // 4. Finalize and Clear Order
  const handleFinalize = () => {
    setIsFinalizing(true);
    setTimeout(() => {
      alert("Order Finalized! All replies sent to customer.");
      localStorage.removeItem('latestOrder');
      setOrder(null);
      setIsFinalizing(false);
    }, 1000);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <RefreshCcw className="text-green-300 animate-spin mb-4" size={40} />
        <p className="text-green-800 font-black italic uppercase tracking-widest text-sm">
          Waiting for Customer Order...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-32">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-xl text-white shadow-lg shadow-green-100">
            <Bike size={20} />
          </div>
          <h1 className="text-xl font-black italic tracking-tighter text-slate-800">RIDER PORTAL</h1>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('latestOrder'); setOrder(null); }}
          className="p-2 text-red-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </nav>

      <main className="p-6 max-w-lg mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</p>
            <h2 className="text-lg font-black text-slate-900">{order.orderId || "#ORD-7821"}</h2>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-full border border-green-100">
            <span className="text-green-600 font-black text-xs uppercase tracking-tighter">
              {order.items.length} Items Received
            </span>
          </div>
        </div>

        {/* Item List */}
        <div className="space-y-6">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="group bg-white border-2 border-slate-50 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
              {/* Shop Tag */}
              <div className="absolute top-0 right-0 bg-slate-100 px-4 py-1 rounded-bl-2xl">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.shopName}</span>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 pr-4">
                  <h3 className={`text-lg font-black leading-tight ${item.isCustom ? 'text-blue-600' : 'text-slate-800'}`}>
                    {item.name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">
                    {item.isCustom ? "Custom/Voice Request" : `Price: Rs ${item.price}`}
                  </p>
                </div>
                
                {/* Play Customer Request */}
                <button 
                  onClick={() => playRequest(item)}
                  className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-sm"
                >
                  <Volume2 size={20} />
                </button>
              </div>

              {/* Rider Reply Input Area */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Your Item Response</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 rounded-2xl px-5 py-4 border border-slate-100 flex items-center min-h-[56px]">
                    <p className={`text-sm font-bold ${item.riderReply ? 'text-green-600' : 'text-slate-300 italic'}`}>
                      {item.riderReply || "Hold mic to reply..."}
                    </p>
                  </div>
                  <button 
                    onMouseDown={() => startRiderMic(i)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                      activeMic === i 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-green-600 text-white shadow-green-100 hover:bg-green-700'
                    }`}
                  >
                    <Mic size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Finalize Button */}
      <div className="fixed bottom-8 left-6 right-6 max-w-lg mx-auto">
        <button 
          onClick={handleFinalize}
          disabled={isFinalizing}
          className="w-full bg-slate-900 text-white py-5 rounded-[2.2rem] font-black shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm transition-all active:scale-95 disabled:opacity-50"
        >
          {isFinalizing ? (
             <RefreshCcw className="animate-spin" size={20} />
          ) : (
            <>
              <CheckCircle2 size={20} className="text-green-500" />
              Finalize & Send All
            </>
          )}
        </button>
      </div>
    </div>
  );
}