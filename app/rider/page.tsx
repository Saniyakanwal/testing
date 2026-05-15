"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mic, Play, Bike, CheckCircle2, 
  Volume2, RefreshCw, Trash2, Headphones 
} from 'lucide-react';

export default function RiderFreshPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [activeMic, setActiveMic] = useState<number | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('latestOrder');
    if (data) setOrder(JSON.parse(data));
  }, []);

  // 1. Customer ki Voice Sun-na (Using Text-to-Speech fallback for easy testing)
  const listenCustomerVoice = (itemName: string) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(`Customer says: ${itemName}`);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // 2. Rider ka Text Response handle karna
  const handleTextResponse = (index: number, val: string) => {
    const updatedItems = [...order.items];
    updatedItems[index].riderTextReply = val;
    setOrder({ ...order, items: updatedItems });
  };

  // 3. Rider ka Voice Response Record karna
  const recordVoiceResponse = (index: number) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Chrome use karein voice record ke liye");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setActiveMic(index);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const updatedItems = [...order.items];
      updatedItems[index].riderVoiceReply = transcript; // Voice transcript save hui
      setOrder({ ...order, items: updatedItems });
    };
    recognition.onend = () => setActiveMic(null);
    recognition.start();
  };

  // 4. Rider apni Record ki hui Voice ko sune ga
  const listenOwnVoice = (recordedText: string) => {
    if (!recordedText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`Your recorded response is: ${recordedText}`);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // 5. Order Confirm & Redirect to Main Page
  const handleConfirmOrder = () => {
    alert("Order Finalized! Redirecting to Marketplace...");
    localStorage.removeItem('latestOrder');
    setOrder(null);
    router.push('/'); // Main customer page par wapas redirect
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <RefreshCw className="text-green-500 animate-spin mb-4" size={32} />
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Waiting for Customer Order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-32">
      {/* Header */}
      <nav className="sticky top-0 bg-white border-b px-6 py-5 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-xl text-white shadow-md"><Bike size={20} /></div>
          <h1 className="text-lg font-black italic tracking-tight">RIDER DASHBOARD</h1>
        </div>
        <button onClick={() => { localStorage.removeItem('latestOrder'); setOrder(null); }} className="text-slate-300 hover:text-red-500"><Trash2 size={20}/></button>
      </nav>

      <main className="p-6 max-w-md mx-auto space-y-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items from Shop(s)</p>

        {order.items.map((item: any, i: number) => {
          // Check custom type
          const isVoiceRequest = item.isCustom && item.name.includes("🎙️");
          const isTextRequest = item.isCustom && !item.name.includes("🎙️");

          return (
            <div key={i} className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden">
              {/* Shop Badge */}
              <div className="absolute top-0 right-0 bg-slate-900 text-white text-[8px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-widest">
                {item.shopName}
              </div>

              {/* Product Layout */}
              <div className="mb-4 pt-2">
                <h3 className={`text-lg font-black leading-tight ${item.isCustom ? 'text-blue-600' : 'text-slate-800'}`}>
                  {item.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                  {item.isCustom ? "Special Request" : `Rs ${item.price} • Fixed Price`}
                </p>
              </div>

              {/* ----------------- CASE 1: CUSTOMER VOICE REQUEST ----------------- */}
              {isVoiceRequest && (
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                  {/* Listen Customer */}
                  <button 
                    onClick={() => listenCustomerVoice(item.name)}
                    className="w-full bg-blue-50 text-blue-600 p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all"
                  >
                    <Volume2 size={16} /> Customer ki Voice Suno
                  </button>

                  {/* Rider Voice Response */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Your Voice Response</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => recordVoiceResponse(i)}
                        className={`flex-1 p-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeMic === i ? 'bg-red-500 text-white animate-pulse' : 'bg-green-600 text-white'}`}
                      >
                        <Mic size={16} /> {activeMic === i ? "Recording..." : "Voice Reply Record"}
                      </button>

                      {/* Listen own voice */}
                      {item.riderVoiceReply && (
                        <button 
                          onClick={() => listenOwnVoice(item.riderVoiceReply)}
                          className="bg-slate-100 text-slate-700 px-4 rounded-2xl flex items-center justify-center active:scale-95"
                          title="Apni voice suno"
                        >
                          <Headphones size={18} />
                        </button>
                      )}
                    </div>
                    {item.riderVoiceReply && (
                      <p className="text-[11px] font-bold text-green-600 italic ml-1">Recorded: "{item.riderVoiceReply}"</p>
                    )}
                  </div>
                </div>
              )}

              {/* ----------------- CASE 2: CUSTOMER TEXT REQUEST ----------------- */}
              {isTextRequest && (
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Type Reply to Text Request</p>
                  <input 
                    type="text"
                    value={item.riderTextReply || ""}
                    onChange={(e) => handleTextResponse(i, e.target.value)}
                    placeholder="Write answer here..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* ----------------- CASE 3: MANUAL/NORMAL PRODUCT ----------------- */}
              {!item.isCustom && (
                <div className="mt-4 bg-green-50/50 p-3 rounded-2xl border border-green-50 text-center">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">✓ Sorted (No Action Required)</p>
                </div>
              )}

            </div>
          );
        })}
      </main>

      {/* Confirm & Redirect Footer */}
      <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto">
        <button 
          onClick={handleConfirmOrder}
          className="w-full bg-slate-900 text-white py-5 rounded-[2.2rem] font-black shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm active:scale-95 transition-all"
        >
          <CheckCircle2 size={20} className="text-green-500" /> Confirm & Back to Main
        </button>
      </div>
    </div>
  );
}