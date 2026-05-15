"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Send, Package, MessageSquare, CheckCircle, Volume2, Trash2, User } from 'lucide-react';

export default function RiderSeparateControl() {
  const [order, setOrder] = useState<any>(null);
  const [recordingId, setRecordingId] = useState<number | null>(null);
  const [previews, setPreviews] = useState<{ [key: number]: string }>({}); // Har item ki apni recording
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const savedOrder = localStorage.getItem('latestOrder');
    if (savedOrder) setOrder(JSON.parse(savedOrder));
  }, []);

  // --- Voice Recording Logic ---
  const startRecording = async (itemId: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4' };
      
      mediaRecorder.current = new MediaRecorder(stream, options);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: options.mimeType });
        const url = URL.createObjectURL(audioBlob);
        setPreviews(prev => ({ ...prev, [itemId]: url }));
      };

      mediaRecorder.current.start();
      setRecordingId(itemId);
    } catch (err) {
      alert("Mic access denied!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recordingId !== null) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setRecordingId(null);
    }
  };

  const playAudio = (url: string) => {
    new Audio(url).play().catch(() => alert("Playback error"));
  };

  if (!order) return <div className="p-10 text-center">Loading Order...</div>;

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24">
      {/* Header */}
      <div className="bg-[#075e54] p-4 text-white sticky top-0 z-20 flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center"><User size={20}/></div>
        <h1 className="font-bold text-sm">Rider Dashboard</h1>
      </div>

      <div className="p-4 space-y-4">
        {order.items.map((item: any) => {
          // Categorize Item
          const isFromList = !item.isCustom;
          const isTypedCustom = item.isCustom && !item.name.includes("Voice Note");
          const isVoiceCustom = item.isCustom && item.name.includes("Voice Note");

          return (
            <div key={item.cartId} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              
              {/* ITEM HEADER */}
              <div className="p-4 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isFromList ? 'bg-slate-50 text-slate-400' : 'bg-green-50 text-green-600'}`}>
                    {isFromList ? <Package size={18}/> : <MessageSquare size={18}/>}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{item.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{item.shopName}</p>
                  </div>
                </div>
                {isFromList && <div className="font-black text-green-600 text-sm">Rs {item.price}</div>}
              </div>

              {/* INTERACTION SECTION (Only for Custom Items) */}
              {(isTypedCustom || isVoiceCustom) && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                  
                  {/* If it's a Voice Note from Customer */}
                  {isVoiceCustom && (
                    <button 
                      onClick={() => alert("Playing Customer Voice...")}
                      className="w-full flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-100 text-blue-600 mb-2"
                    >
                      <Volume2 size={16} />
                      <span className="text-[10px] font-black uppercase">Listen Customer Voice</span>
                    </button>
                  )}

                  {/* Text Reply (Available for both Custom types) */}
                  <div className="flex gap-2">
                    <input type="text" placeholder="Type message..." className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-xs outline-none" />
                    <button className="bg-[#075e54] text-white p-2.5 rounded-full"><Send size={14}/></button>
                  </div>

                  {/* Voice Reply (Only for Voice Custom Items) */}
                  {isVoiceCustom && (
                    <div className="space-y-2">
                      <button 
                        onPointerDown={() => startRecording(item.cartId)}
                        onPointerUp={stopRecording}
                        className={`w-full py-3 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 border touch-none ${
                          recordingId === item.cartId ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-green-700 border-green-200'
                        }`}
                      >
                        <Mic size={14} /> {recordingId === item.cartId ? "RECORDING..." : "HOLD TO VOICE REPLY"}
                      </button>

                      {/* Preview for this specific item */}
                      {previews[item.cartId] && (
                        <div className="flex items-center gap-3 bg-green-100 p-2 rounded-xl border border-green-200">
                          <button onClick={() => playAudio(previews[item.cartId])} className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                            <Play size={14} fill="white" />
                          </button>
                          <span className="text-[9px] font-bold text-green-800 flex-1 uppercase tracking-tighter">Your Voice Preview</span>
                          <button onClick={() => {
                            const newPreviews = {...previews};
                            delete newPreviews[item.cartId];
                            setPreviews(newPreviews);
                          }} className="text-red-400 p-1"><Trash2 size={14}/></button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual Price Entry for Custom Items */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200 mt-2">
                    <span className="text-[10px] font-bold text-slate-400">Price:</span>
                    <input type="number" placeholder="Enter Amount" className="w-24 p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex items-center justify-between shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Bill</p>
          <p className="text-xl font-black text-slate-800 italic">Rs {order.total}</p>
        </div>
        <button className="bg-[#075e54] text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg">
          FINISH ORDER <CheckCircle size={18}/>
        </button>
      </div>
    </div>
  );
}