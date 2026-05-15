"use client";
import React, { useState, useEffect } from 'react';
import { 
  Package, Mic, Play, MessageSquare, CheckCircle, 
  User, MapPin, Phone, ChevronRight, DollarSign 
} from 'lucide-react';

export default function RiderPage() {
  const [order, setOrder] = useState<any>(null);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  // Customer ka order data uthana
  useEffect(() => {
    const savedOrder = localStorage.getItem('latestOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  const handlePriceUpdate = (cartId: number, price: string) => {
    setResponses({ ...responses, [cartId]: price });
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-10 text-center">
        <div>
          <Package size={64} className="mx-auto text-slate-300 mb-4 animate-pulse" />
          <h2 className="text-xl font-bold text-slate-500">Waiting for new orders...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      {/* Header */}
      <div className="bg-slate-800 p-6 rounded-b-[3rem] shadow-2xl border-b border-slate-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="bg-green-500/20 text-green-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Active Task</span>
            <h1 className="text-3xl font-black mt-2">New Delivery</h1>
          </div>
          <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center border border-slate-600">
            <User size={24} className="text-slate-300" />
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-3xl border border-white/5">
          <div className="p-3 bg-blue-600 rounded-2xl"><MapPin size={20}/></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Customer Location</p>
            <p className="text-sm font-bold">Gulshan-e-Iqbal, Block 13-D, Karachi</p>
          </div>
        </div>
      </div>

      <main className="p-5 space-y-6">
        {/* Cart Items Section */}
        <section>
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2 mb-4">Order Details ({order.items.length})</h2>
          
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.cartId} className={`p-5 rounded-[2.5rem] border ${item.isCustom ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.isCustom ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                      {item.isCustom ? (item.name.includes("Voice") ? <Mic size={20}/> : <MessageSquare size={20}/>) : <Package size={20}/>}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">{item.shopName}</p>
                    </div>
                  </div>
                  {!item.isCustom && <span className="font-black text-green-400">Rs {item.price}</span>}
                </div>

                {/* Rider Action for Custom/Voice Items */}
                {item.isCustom && (
                  <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                    {item.name.includes("Voice") && (
                      <button className="w-full py-3 bg-blue-600 rounded-2xl flex items-center justify-center gap-3 font-black text-sm active:scale-95 transition-all shadow-lg shadow-blue-900/50">
                        <Play size={16} fill="white" /> LISTEN VOICE NOTE
                      </button>
                    )}
                    
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-900 rounded-2xl px-4 py-3 border border-slate-700 flex items-center gap-2">
                        <DollarSign size={16} className="text-green-500"/>
                        <input 
                          type="number" 
                          placeholder="Enter Price..." 
                          className="bg-transparent outline-none text-sm w-full"
                          onChange={(e) => handlePriceUpdate(item.cartId, e.target.value)}
                        />
                      </div>
                      <button className="p-4 bg-green-600 rounded-2xl text-white active:scale-90 transition-all shadow-lg shadow-green-900/50">
                        <CheckCircle size={20}/>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 italic px-2">Rider will confirm price after reaching shop</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Total Summary */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-[3rem] shadow-xl">
          <div className="flex justify-between items-center text-white/80 text-xs font-black uppercase tracking-widest mb-2">
            <span>Customer Total</span>
            <span>Est. Bill</span>
          </div>
          <div className="flex justify-between items-end">
            <h2 className="text-4xl font-black italic">Rs {order.total}</h2>
            <button className="p-4 bg-white text-green-600 rounded-full shadow-lg"><Phone size={20}/></button>
          </div>
        </div>

        <button 
          onClick={() => alert("Order marked as Picked Up!")}
          className="w-full py-6 bg-white text-slate-900 rounded-[2.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          START DELIVERY <ChevronRight size={24}/>
        </button>
      </main>
    </div>
  );
}