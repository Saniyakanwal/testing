"use client";
import React, { useState, useEffect } from 'react';
import { 
  Mic, Play, Volume2, Send, CheckCircle, 
  Store, Package, MessageSquare, DollarSign, Clock 
} from 'lucide-react';

export default function RiderOrderControl() {
  const [order, setOrder] = useState<any>(null);
  const [activeChat, setActiveChat] = useState<number | null>(null); // Kis item par chat khuli hai
  const [replyText, setReplyText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const savedOrder = localStorage.getItem('latestOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  if (!order) return <div className="p-10 text-center text-slate-500">No active orders...</div>;

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-10">
      {/* Header */}
      <div className="bg-[#00a884] p-6 text-white shadow-lg">
        <h1 className="text-xl font-bold">Current Order Items</h1>
        <p className="text-xs opacity-90">Customer: {order.customerName || 'Saniya Kanwal'}</p>
      </div>

      <main className="p-4 space-y-4">
        {order.items.map((item: any) => (
          <div key={item.cartId} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* --- ITEM INFO SECTION --- */}
            <div className="p-4 flex justify-between items-start bg-slate-50/50">
              <div className="flex gap-3">
                <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-600">
                  {item.isCustom ? <MessageSquare size={20}/> : <Package size={20}/>}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{item.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                    <Store size={10} /> {item.shopName}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-green-600">
                  {item.price > 0 ? `Rs ${item.price}` : "Price Pending"}
                </span>
              </div>
            </div>

            {/* --- COMMUNICATION SECTION --- */}
            <div className="p-4 border-t border-slate-100">
              {/* Agar Customer ne Voice Note bheja tha */}
              {item.isCustom && item.name.includes("Voice") && (
                <div className="mb-4 bg-blue-50 p-3 rounded-xl flex items-center gap-3 border border-blue-100">
                  <button className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <Play size={18} fill="white" />
                  </button>
                  <div className="flex-1 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600">0:12</span>
                </div>
              )}

              {/* Action Buttons for Rider */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type reply for this item..." 
                    className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none border border-transparent focus:border-green-500"
                  />
                  <button className="p-3 bg-slate-800 text-white rounded-full">
                    <Send size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onMouseDown={() => setIsRecording(true)}
                    onMouseUp={() => { setIsRecording(false); alert("Voice reply sent for this item!"); }}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[#00a884]/10 text-[#00a884] border border-[#00a884]/20'
                    }`}
                  >
                    <Mic size={16} /> {isRecording ? "RECORDING..." : "HOLD TO VOICE REPLY"}
                  </button>
                  
                  {/* Price Setting (Rider reaching shop) */}
                  <div className="flex items-center bg-yellow-50 border border-yellow-200 rounded-xl px-2">
                    <DollarSign size={14} className="text-yellow-600" />
                    <input type="number" placeholder="Set Price" className="w-16 bg-transparent p-2 text-xs font-bold outline-none" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}

        {/* Total Bill & Finish */}
        <div className="mt-6 bg-white p-6 rounded-[2rem] shadow-xl border-t-4 border-green-500">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Total Estimated</span>
            <span className="text-2xl font-black text-slate-800">Rs {order.total}</span>
          </div>
          <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-slate-300">
            <CheckCircle size={20} /> MARK ALL PICKED UP
          </button>
        </div>
      </main>
    </div>
  );
}