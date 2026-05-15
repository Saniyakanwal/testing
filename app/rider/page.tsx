"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Play, Bike, CheckCircle2, MessageCircle, Volume2 } from 'lucide-react';

export default function RiderAdvancedPage() {
  const [order, setOrder] = useState<any>(null);
  const [riderReply, setRiderReply] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('latestOrder');
    if (data) setOrder(JSON.parse(data));
  }, []);

  // Separate items by Shop
  const groupedItems = order?.items?.reduce((acc: any, item: any) => {
    (acc[item.shopName] = acc[item.shopName] || []).push(item);
    return acc;
  }, {});

  // Rider Voice Recording Logic
  const startRecording = () => {
    setIsRecording(true);
    const Speech = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (Speech) {
      const rec = new Speech();
      rec.onresult = (e: any) => setRiderReply(e.results[0][0].transcript);
      rec.onend = () => setIsRecording(false);
      rec.start();
    }
  };

  const finalize = () => {
    alert("Order Finalized and Reply Sent!");
    localStorage.removeItem('latestOrder');
    setOrder(null);
  };

  if (!order) return <div className="p-20 text-center font-bold text-green-600 animate-pulse">WAITING FOR CUSTOMER...</div>;

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 font-sans pb-20">
      <header className="flex items-center gap-2 mb-8 border-b pb-4">
        <Bike className="text-green-600" />
        <h1 className="text-xl font-black italic">RIDER DASHBOARD</h1>
      </header>

      {/* Grouped Items by Shop */}
      {Object.keys(groupedItems).map((shopName) => (
        <div key={shopName} className="mb-8 bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
          <h2 className="text-xs font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> {shopName}
          </h2>

          <div className="space-y-3">
            {groupedItems[shopName].map((item: any, i: number) => (
              <div key={i} className={`p-4 rounded-2xl flex justify-between items-center ${item.isCustom ? 'bg-blue-50 border border-blue-100' : 'bg-white border border-slate-100'}`}>
                <div>
                  <p className={`font-bold ${item.isCustom ? 'text-blue-700' : 'text-slate-800'}`}>
                    {item.name}
                  </p>
                  <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">
                    {item.isCustom ? "Custom/Voice Request" : `Rs ${item.price}`}
                  </p>
                </div>

                {/* If it's a Voice Note from Customer, show Play Button */}
                {item.name.includes("Voice Note") && (
                  <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg active:scale-90">
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Rider Response Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-6 rounded-t-[3rem] shadow-2xl">
        <div className="mb-4">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-widest">Rider's Audio/Text Reply</p>
          <div className="bg-slate-100 p-5 rounded-[2rem] min-h-[80px] flex items-center justify-between border border-slate-200 shadow-inner">
             <p className="text-sm font-bold text-slate-700">
               {riderReply || "Recording ka intezar hai..."}
             </p>
             {riderReply && <button onClick={() => alert("Playing: " + riderReply)} className="text-green-600 p-2"><Play size={20}/></button>}
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onMouseDown={startRecording}
            onMouseUp={() => setIsRecording(false)}
            className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-white shadow-xl'}`}
          >
            <Mic size={20} /> {isRecording ? "Listening..." : "Hold to Record Reply"}
          </button>
          
          <button onClick={finalize} className="bg-green-600 text-white px-8 rounded-2xl shadow-xl shadow-green-100">
            <CheckCircle2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}