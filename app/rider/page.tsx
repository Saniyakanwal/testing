"use client";
import React from 'react';
import { Bike, MapPin, Phone, MessageCircle, CheckCircle2, Mic } from 'lucide-react';

const MOCK_ORDER = {
  customer: "Saniya K.",
  address: "Block 13, Gulshan-e-Iqbal, Karachi",
  items: [
    { name: "Potato", price: 80, unit: "1 kg", shopName: "Sabzi Mandi" },
    { name: "Milk", price: 210, unit: "1 Ltr", shopName: "Daily Dairy" },
  ],
  custom: [
    { shopName: "Sabzi Mandi", text: "Bhai tamatar laal hon aur sakht hon.", type: "text" }
  ]
};

export default function RiderPage() {
  const shops = Array.from(new Set(MOCK_ORDER.items.map(i => i.shopName)));

  return (
    <div className="min-h-screen bg-zinc-900 text-white pb-20">
      <header className="p-6 bg-yellow-400 text-black flex justify-between items-center rounded-b-[40px] shadow-2xl">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter">NEW JOB</h1>
          <p className="text-xs font-bold opacity-70 flex items-center gap-1">
            <Bike size={14} /> ACTIVE ORDER #4521
          </p>
        </div>
        <div className="h-12 w-12 bg-black/10 rounded-full flex items-center justify-center">
          <CheckCircle2 size={30} />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 -mt-6">
        {/* Customer Detail Card */}
        <div className="bg-zinc-800 rounded-3xl p-5 shadow-xl border border-zinc-700 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-yellow-400">{MOCK_ORDER.customer}</h2>
              <p className="text-sm text-zinc-400 flex items-center gap-1 mt-1">
                <MapPin size={14} className="text-red-500" /> {MOCK_ORDER.address}
              </p>
            </div>
            <button className="p-3 bg-zinc-700 rounded-2xl text-yellow-400 active:scale-90 transition-all">
              <Phone size={20} />
            </button>
          </div>
        </div>

        {/* Shop-wise Tasks */}
        <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest ml-2 mb-3">Shopping Checklist</h3>
        
        <div className="space-y-4">
          {shops.map((shop) => (
            <div key={shop} className="bg-zinc-800 rounded-3xl overflow-hidden border border-zinc-700">
              <div className="bg-zinc-700/50 px-5 py-3 flex justify-between items-center">
                <span className="font-bold text-yellow-400 tracking-wide uppercase text-xs">{shop}</span>
                <span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded-full font-black">PENDING</span>
              </div>
              
              <div className="p-5 space-y-3">
                {MOCK_ORDER.items.filter(i => i.shopName === shop).map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded-md border-zinc-600 bg-zinc-900 text-yellow-400 focus:ring-0 focus:ring-offset-0" />
                    <span className="text-zinc-300 group-hover:text-white transition-colors">
                      {item.name} <span className="text-zinc-500 text-sm">({item.unit})</span>
                    </span>
                  </label>
                ))}

                {/* Custom Instructions */}
                {MOCK_ORDER.custom.filter(c => c.shopName === shop).map((req, i) => (
                  <div key={i} className="mt-4 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl">
                    <p className="text-[10px] text-yellow-400 font-black uppercase mb-1">Customer Note:</p>
                    <p className="text-sm italic text-zinc-300">"{req.text}"</p>
                    
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 bg-zinc-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                        <Mic size={14}/> Voice Reply
                      </button>
                      <button className="flex-1 bg-zinc-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                        <MessageCircle size={14}/> Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
        <button className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl shadow-[0_20px_50px_rgba(234,179,8,0.3)] active:scale-95 transition-all">
          COMPLETE SHOPPING & DELIVER
        </button>
      </div>
    </div>
  );
}