"use client";
import React, { useState, useEffect } from 'react';
import { 
  Package, Mic, Play, MessageSquare, CheckCircle, 
  Volume2, StopCircle, DollarSign, ChevronRight, Phone
} from 'lucide-react';

export default function RiderPage() {
  const [order, setOrder] = useState<any>(null);
  const [isReplying, setIsReplying] = useState<number | null>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem('latestOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  if (!order) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold">Loading Order...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-10 font-sans">
      {/* Header */}
      <div className="p-8 bg-slate-900 rounded-b-[3rem] border-b border-white/5">
        <h1 className="text-2xl font-black italic text-blue-500">RIDER DASHBOARD</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">New Task assigned</p>
      </div>

      <main className="p-6 space-y-6">
        {order.items.map((item: any) => {
          // Check if it's a voice note or text request
          const isVoiceNote = item.isCustom && item.name.includes("Voice Note");

          return (
            <div key={item.cartId} className={`p-6 rounded-[2.5rem] border transition-all ${isVoiceNote ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-900 border-white/5'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isVoiceNote ? 'bg-blue-600 shadow-lg shadow-blue-500/50' : 'bg-slate-800'}`}>
                    {isVoiceNote ? <Mic size={20} className="text-white"/> : <Package size={20} className="text-slate-500"/>}
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">
                      {isVoiceNote ? "Voice Message From Customer" : item.name}
                    </h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{item.shopName}</p>
                  </div>
                </div>
                {!item.isCustom && <span className="font-black text-green-400">Rs {item.price}</span>}
              </div>

              {/* --- CONDITION 1: VOICE NOTE CONTROLS --- */}
              {isVoiceNote && (
                <div className="mt-4 space-y-3">
                  {/* Customer ki voice sunna */}
                  <button 
                    onClick={() => alert("Playing Customer Audio...")}
                    className="w-full py-4 bg-slate-800 text-blue-400 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest border border-blue-500/20 active:scale-95 transition-all"
                  >
                    <Volume2 size={16} /> Play Customer Voice
                  </button>

                  {/* Rider ka apna voice reply */}
                  <button 
                    onMouseDown={() => setIsReplying(item.cartId)}
                    onMouseUp={() => { setIsReplying(null); alert("Voice Response Sent!"); }}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] flex items-center justify-center gap-3 border transition-all ${
                      isReplying === item.cartId 
                      ? "bg-red-600 border-red-500 text-white animate-pulse" 
                      : "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    }`}
                  >
                    {isReplying === item.cartId ? <StopCircle size={18}/> : <Mic size={18}/>}
                    {isReplying === item.cartId ? "RECORDING..." : "HOLD TO VOICE REPLY"}
                  </button>
                </div>
              )}

              {/* --- CONDITION 2: PRICE UPDATE (For all Custom items) --- */}
              {item.isCustom && (
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                  <div className="flex-1 bg-black/40 rounded-2xl px-4 py-3 border border-white/5 flex items-center gap-2">
                    <DollarSign size={14} className="text-green-500"/>
                    <input type="number" placeholder="Set Price" className="bg-transparent outline-none text-xs font-bold w-full text-white" />
                  </div>
                  <button className="p-4 bg-green-600 text-white rounded-2xl active:scale-90 transition-all">
                    <CheckCircle size={20}/>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Action Button */}
        <button className="w-full py-6 bg-white text-black rounded-[2.5rem] font-black text-lg shadow-2xl flex items-center justify-center gap-3 uppercase active:scale-95 transition-all">
          Start Pick-up <ChevronRight size={20}/>
        </button>
      </main>
    </div>
  );
}