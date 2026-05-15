"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Play, Bike, CheckCircle2, Volume2, MessageSquare, Send } from 'lucide-react';

export default function RiderPage() {
  const [order, setOrder] = useState<any>(null);
  const [activeRecordingItem, setActiveRecordingItem] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('latestOrder');
    if (data) setOrder(JSON.parse(data));
  }, []);

  // Customer ki voice sun-ne ke liye function
  const playCustomerVoice = (audioBase64: string) => {
    if (!audioBase64) return alert("Voice note nahi mila");
    const audio = new Audio(audioBase64);
    audio.play();
  };

  // Rider ka specific item par reply record karna
  const handleRiderReply = (index: number, text: string) => {
    const newItems = [...order.items];
    newItems[index].riderReply = text;
    setOrder({ ...order, items: newItems });
  };

  const startVoiceCapture = (index: number) => {
    const Speech = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!Speech) return alert("Mic not supported");

    const rec = new Speech();
    rec.onstart = () => { setIsListening(true); setActiveRecordingItem(index); };
    rec.onresult = (e: any) => handleRiderReply(index, e.results[0][0].transcript);
    rec.onend = () => { setIsListening(false); setActiveRecordingItem(null); };
    rec.start();
  };

  const finalizeOrder = () => {
    alert("Saare replies save ho gaye hain!");
    localStorage.setItem('latestOrder', JSON.stringify(order)); // Updates with rider replies
    localStorage.removeItem('latestOrder'); // Clear for next order
    setOrder(null);
  };

  if (!order) return <div className="p-20 text-center font-bold text-green-600 uppercase tracking-widest animate-pulse">Waiting for Order...</div>;

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 font-sans pb-32">
      <header className="flex items-center gap-3 mb-10 border-b border-green-50 pb-4">
        <div className="bg-green-600 p-2 rounded-xl text-white"><Bike size={24} /></div>
        <h1 className="text-xl font-black italic">RIDER PORTAL</h1>
      </header>

      <div className="space-y-8">
        {order.items.map((item: any, i: number) => (
          <div key={i} className="border-2 border-slate-50 rounded-[2.5rem] p-6 shadow-sm bg-white relative overflow-hidden">
            {/* Shop Badge */}
            <div className="absolute top-0 right-0 bg-slate-900 text-white text-[8px] px-4 py-1 rounded-bl-xl font-black uppercase tracking-widest">
              {item.shopName}
            </div>

            {/* Product Info */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`text-lg font-black ${item.isCustom ? 'text-blue-600' : 'text-slate-800'}`}>
                  {item.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {item.isCustom ? "Custom Request" : `Price: Rs ${item.price}`}
                </p>
              </div>

              {/* Play Customer Voice Button (Sirf agar voice note ho) */}
              {item.isCustom && (
                <button 
                  onClick={() => playCustomerVoice(item.audioData)} 
                  className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-100 active:scale-90 transition-all flex items-center gap-2"
                >
                  <Volume2 size={18} />
                  <span className="text-[10px] font-black uppercase">Suno</span>
                </button>
              )}
            </div>

            {/* Rider's Reply Box (Har Item Ke Neechai) */}
            <div className="mt-6 space-y-3">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">Your Reply to this item</p>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={item.riderReply || ""}
                  onChange={(e) => handleRiderReply(i, e.target.value)}
                  placeholder="Reply likhain ya bolain..."
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-green-500 transition-all"
                />
                <button 
                  onClick={() => startVoiceCapture(i)}
                  className={`p-4 rounded-2xl transition-all ${activeRecordingItem === i ? 'bg-red-500 text-white animate-pulse' : 'bg-green-100 text-green-600'}`}
                >
                  <Mic size={18} />
                </button>
              </div>
              
              {/* Review Playback for Rider */}
              {item.riderReply && (
                <div className="flex items-center gap-2 ml-2 text-green-600">
                  <Play size={12} fill="currentColor" />
                  <span className="text-[10px] font-bold italic">Rider: "{item.riderReply}"</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Finalize Button */}
      <div className="fixed bottom-8 left-6 right-6">
        <button 
          onClick={finalizeOrder}
          className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          <CheckCircle2 size={20} className="text-green-500" /> Confirm All Replies
        </button>
      </div>
    </div>
  );
}