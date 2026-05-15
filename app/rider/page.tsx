"use client";
import React, { useState, useEffect } from 'react';
import { Mic, Play, Send, Store, Package, MessageSquare, Check, Volume2 } from 'lucide-react';

export default function RiderFinalScreen() {
  const [order, setOrder] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const savedOrder = localStorage.getItem('latestOrder');
    if (savedOrder) setOrder(JSON.parse(savedOrder));
  }, []);

  // Real voice play simulation
  const playAudio = (id: number) => {
    console.log("Playing audio for item:", id);
    const audio = new Audio('/customer-voice-sample.mp3'); // Path to your storage
    audio.play().catch(() => alert("Playing Voice Note... (Attach your audio source here)"));
  };

  if (!order) return <div className="p-10 text-center font-bold">No Orders Yet...</div>;

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      {/* Header */}
      <div className="bg-[#075e54] p-5 text-white sticky top-0 z-10 shadow-md">
        <h1 className="text-lg font-bold">Rider Order Panel</h1>
        <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">Karachi - Active Order</p>
      </div>

      <div className="p-4 space-y-4">
        {order.items.map((item: any) => (
          <div key={item.cartId} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* ITEM INFO */}
            <div className="p-4 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                  {item.isCustom ? <MessageSquare size={18}/> : <Package size={18}/>}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm">{item.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Store size={10}/> {item.shopName}
                  </p>
                </div>
              </div>

              {/* Price Logic: Agar list se hai to fixed, agar custom hai to manual */}
              <div className="text-right">
                {!item.isCustom ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">
                    Rs {item.price}
                  </span>
                ) : (
                  <input 
                    type="number" 
                    placeholder="Set Price" 
                    className="w-20 p-2 bg-yellow-50 border border-yellow-200 rounded-xl text-xs font-bold text-yellow-700 outline-none"
                  />
                )}
              </div>
            </div>

            {/* CHAT/VOICE AREA FOR THIS ITEM */}
            <div className="p-4 border-t border-slate-50 space-y-3">
              
              {/* 1. Customer ki Voice Sun'na */}
              {item.isCustom && item.name.includes("Voice") && (
                <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-2xl border border-blue-100">
                  <button 
                    onClick={() => playAudio(item.cartId)}
                    className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90"
                  >
                    <Play size={16} fill="white"/>
                  </button>
                  <div className="flex-1 text-[10px] font-bold text-blue-700 uppercase tracking-tighter">
                    Customer Voice Note
                  </div>
                  <Volume2 size={14} className="text-blue-300 mr-2" />
                </div>
              )}

              {/* 2. Rider ka Reply Section */}
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-xs outline-none focus:ring-1 ring-green-500"
                  />
                  <button className="p-2.5 bg-slate-800 text-white rounded-full">
                    <Send size={14}/>
                  </button>
                </div>

                {/* RIDER VOICE RECORDING BUTTON */}
                <button 
                  onMouseDown={() => setIsRecording(true)}
                  onMouseUp={() => { setIsRecording(false); alert("Rider Voice Recorded & Sent!"); }}
                  className={`w-full py-3 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 transition-all border shadow-sm ${
                    isRecording 
                    ? 'bg-red-600 border-red-500 text-white animate-pulse' 
                    : 'bg-white border-slate-200 text-slate-600 active:bg-slate-50'
                  }`}
                >
                  <Mic size={14} className={isRecording ? 'text-white' : 'text-green-600'} />
                  {isRecording ? "RECORDING YOUR VOICE..." : "HOLD TO SEND VOICE REPLY"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase">Total Items: {order.items.length}</p>
          <p className="text-lg font-black text-slate-800 tracking-tighter text-green-600">Rs {order.total}</p>
        </div>
        <button className="bg-[#128c7e] text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all">
          <Check size={18} strokeWidth={4}/> ALL PICKED UP
        </button>
      </div>
    </div>
  );
}