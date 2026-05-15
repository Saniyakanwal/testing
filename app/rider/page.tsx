"use client";
import React, { useState, useEffect } from 'react';
import { 
  Package, Mic, Play, MessageSquare, CheckCircle, 
  User, MapPin, Phone, ChevronRight, DollarSign, StopCircle, Volume2
} from 'lucide-react';

export default function RiderPage() {
  const [order, setOrder] = useState<any>(null);
  const [isReplying, setIsReplying] = useState<number | null>(null); // Konsay item ka reply ho raha hai

  useEffect(() => {
    const savedOrder = localStorage.getItem('latestOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  // Customer ki voice sunne ka function (Simulation)
  const playCustomerVoice = (itemName: string) => {
    alert(`Playing Customer Voice for: ${itemName}`);
    // Yahan real audio play logic aayega
  };

  // Rider ki apni voice record karne ka function
  const handleRiderReply = (cartId: number) => {
    setIsReplying(null);
    alert("Your voice response has been sent to the customer!");
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center animate-pulse">
          <Package size={64} className="mx-auto mb-4 text-slate-700" />
          <p className="font-bold text-slate-500">Checking for new tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 p-8 rounded-b-[3.5rem] border-b border-white/5 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter">TASK <span className="text-blue-500">#442</span></h1>
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-green-500 flex items-center justify-center text-[10px] font-black">LIVE</div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/20 p-5 rounded-[2rem] border border-white/5">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40"><MapPin size={24} className="text-white"/></div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Drop-off Point</p>
            <p className="text-sm font-bold text-white">Gulshan-e-Iqbal, Block 13-D</p>
          </div>
          <button className="p-4 bg-slate-800 rounded-2xl text-green-400"><Phone size={20}/></button>
        </div>
      </div>

      <main className="p-6 space-y-6">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Shopping List</h2>

        {order.items.map((item: any) => (
          <div key={item.cartId} className={`relative overflow-hidden p-6 rounded-[2.5rem] border transition-all ${item.isCustom ? 'bg-blue-600/5 border-blue-500/20' : 'bg-slate-900 border-white/5'}`}>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${item.isCustom ? 'bg-blue-600 shadow-lg shadow-blue-900/50' : 'bg-slate-800 text-slate-500'}`}>
                  {item.isCustom ? <Mic size={24} className="text-white"/> : <Package size={24}/>}
                </div>
                <div>
                  <h3 className="font-black text-lg text-white leading-tight">{item.name}</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.shopName}</p>
                </div>
              </div>
              {!item.isCustom && <div className="text-right text-green-400 font-black text-lg italic">Rs {item.price}</div>}
            </div>

            {/* Custom/Voice Item Controls */}
            {item.isCustom && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                {/* 1. Listen to Customer */}
                <button 
                  onClick={() => playCustomerVoice(item.name)}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xs tracking-widest uppercase transition-all"
                >
                  <Volume2 size={18} className="text-blue-400" /> Listen Customer Voice
                </button>

                {/* 2. Rider's Voice Reply */}
                <div className="relative">
                  <button 
                    onMouseDown={() => setIsReplying(item.cartId)}
                    onMouseUp={() => handleRiderReply(item.cartId)}
                    onTouchStart={() => setIsReplying(item.cartId)}
                    onTouchEnd={() => handleRiderReply(item.cartId)}
                    className={`w-full py-5 rounded-2xl font-black text-xs flex items-center justify-center gap-3 border transition-all ${
                      isReplying === item.cartId 
                      ? "bg-red-600 border-red-500 text-white animate-pulse" 
                      : "bg-blue-600/10 border-blue-600/30 text-blue-400"
                    }`}
                  >
                    {isReplying === item.cartId ? <StopCircle size={20}/> : <Mic size={18}/>}
                    {isReplying === item.cartId ? "RECORDING YOUR RESPONSE..." : "HOLD TO REPLY WITH VOICE"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 bg-black/40 rounded-2xl px-5 py-4 border border-white/5 flex items-center gap-3">
                    <DollarSign size={18} className="text-green-500"/>
                    <input type="number" placeholder="Enter Price" className="bg-transparent outline-none text-sm font-bold w-full text-white" />
                  </div>
                  <button className="p-4 bg-green-600 text-white rounded-2xl shadow-lg shadow-green-900/40 active:scale-90 transition-all">
                    <CheckCircle size={24}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Final Action */}
        <div className="pt-4">
          <button className="w-full py-6 bg-white text-black rounded-[2.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 uppercase tracking-tighter">
            Confirm & Start Delivery <ChevronRight size={24}/>
          </button>
        </div>
      </main>
    </div>
  );
}