"use client";
import React, { useState, useEffect } from 'react';
import { 
  Mic, Play, Send, Store, Package, MessageSquare, 
  CheckCircle, Volume2, Trash2, StopCircle, User 
} from 'lucide-react';

export default function RiderFreshPage() {
  const [order, setOrder] = useState<any>(null);
  const [riderVoice, setRiderVoice] = useState<string | null>(null); // Rider ki recorded voice
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const savedOrder = localStorage.getItem('latestOrder');
    if (savedOrder) setOrder(JSON.parse(savedOrder));
  }, []);

  // Customer ki voice sunne ke liye
  const playCustomerVoice = () => {
    alert("Playing Customer's Voice Note...");
  };

  // Rider ki apni recorded voice sunne ke liye
  const playMyVoice = () => {
    if(riderVoice) alert("Playing your recorded voice back to you...");
  };

  const handleFinishOrder = () => {
    alert("Order Completed! Moving to next delivery.");
  };

  if (!order) return <div className="p-10 text-center font-bold">No Orders Found.</div>;

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24 font-sans">
      {/* WhatsApp Style Header */}
      <div className="bg-[#008069] p-4 text-white sticky top-0 z-20 flex items-center gap-4 shadow-md">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-[#008069]">
          <User size={24} />
        </div>
        <div>
          <h1 className="font-bold text-sm">Customer Order</h1>
          <p className="text-[10px] opacity-80 italic">Active Delivery - Karachi</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {order.items.map((item: any) => (
          <div key={item.cartId} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* ITEM BASIC INFO */}
            <div className="p-4 flex justify-between items-center border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                  {item.isCustom ? <MessageSquare size={18}/> : <Package size={18}/>}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    {item.shopName}
                  </p>
                </div>
              </div>
              
              {/* FIXED PRICE: Jo wahan se add huye unke liye */}
              {!item.isCustom && (
                <div className="text-right font-black text-green-600 text-sm">
                  Rs {item.price}
                </div>
              )}
            </div>

            {/* CUSTOM INTERACTION: Sirf Voice/Text items ke liye */}
            {item.isCustom && (
              <div className="p-4 bg-slate-50 space-y-4">
                
                {/* 1. Customer Voice (Rider Sun Sakta Hai) */}
                {item.name.includes("Voice") && (
                  <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
                    <button onClick={playCustomerVoice} className="w-8 h-8 bg-[#25d366] text-white rounded-full flex items-center justify-center">
                      <Play size={14} fill="white" />
                    </button>
                    <div className="flex-1 h-1 bg-slate-200 rounded-full">
                      <div className="w-1/2 h-full bg-[#25d366] rounded-full" />
                    </div>
                    <span className="text-[10px] text-slate-400">0:15</span>
                    <Volume2 size={14} className="text-slate-300" />
                  </div>
                )}

                {/* 2. Rider ka Reply (Text + Voice Recording) */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type reply..." 
                      className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-xs outline-none focus:border-[#008069]"
                    />
                    <button className="bg-[#008069] text-white p-2.5 rounded-full shadow-md">
                      <Send size={14} />
                    </button>
                  </div>

                  {/* Rider Recording Control */}
                  <div className="flex flex-col gap-2">
                    <button 
                      onMouseDown={() => setIsRecording(true)}
                      onMouseUp={() => { setIsRecording(false); setRiderVoice("recorded"); }}
                      className={`w-full py-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 border transition-all ${
                        isRecording 
                        ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                        : 'bg-white text-[#008069] border-[#008069]'
                      }`}
                    >
                      <Mic size={16} /> {isRecording ? "Recording... (Release to Stop)" : "Hold to Record Reply"}
                    </button>

                    {/* Rider apni voice sun sake (WhatsApp style preview) */}
                    {riderVoice && !isRecording && (
                      <div className="flex items-center gap-2 bg-green-50 p-2 rounded-xl border border-green-100 mt-1">
                        <button onClick={playMyVoice} className="p-2 bg-green-600 text-white rounded-full">
                          <Play size={12} fill="white"/>
                        </button>
                        <p className="text-[10px] font-bold text-green-700 flex-1">Your Voice Note Ready</p>
                        <button onClick={() => setRiderVoice(null)} className="text-slate-400 p-1">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Manual Price Entry for Custom Item */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-[10px] font-bold text-slate-500">Shop Price:</span>
                    <input type="number" placeholder="Enter Rs" className="w-24 p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FINISH ORDER BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase">Estimated Total</p>
          <p className="text-xl font-black text-slate-800">Rs {order.total}</p>
        </div>
        <button 
          onClick={handleFinishOrder}
          className="bg-[#008069] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2"
        >
          FINISH ORDER <CheckCircle size={18}/>
        </button>
      </div>
    </div>
  );
}