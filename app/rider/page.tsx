"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Send, Package, MessageSquare, CheckCircle, Volume2, Trash2, User } from 'lucide-react';

export default function RiderFinalFix() {
  const [order, setOrder] = useState<any>(null);
  const [recordingId, setRecordingId] = useState<number | null>(null);
  const [previews, setPreviews] = useState<{ [key: number]: string }>({}); 
  
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
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      
      mediaRecorder.current = new MediaRecorder(stream, { mimeType });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: mimeType });
        
        // Mobile playback fix: Convert to Base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setPreviews(prev => ({ ...prev, [itemId]: base64Audio }));
        };
      };

      mediaRecorder.current.start();
      setRecordingId(itemId);
    } catch (err) {
      alert("Mobile Mic Error: Please allow microphone access in settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recordingId !== null) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setRecordingId(null);
    }
  };

  const playAudio = (audioData: string) => {
    const audio = new Audio(audioData);
    audio.play().catch(e => {
      console.error("Playback error:", e);
      alert("Please tap again to play (Browser Security Check)");
    });
  };

  if (!order) return <div className="p-10 text-center font-bold">Order loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* Header */}
      <div className="bg-[#075e54] p-4 text-white sticky top-0 z-20 flex items-center gap-3 shadow-lg">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-bold">R</div>
        <h1 className="font-bold text-sm">Rider Delivery View</h1>
      </div>

      <div className="p-4 space-y-4">
        {order.items.map((item: any) => {
          const isFromList = !item.isCustom;
          const isTypedCustom = item.isCustom && !item.name.includes("Voice Note");
          const isVoiceCustom = item.isCustom && item.name.includes("Voice Note");

          return (
            <div key={item.cartId} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              
              {/* Item Info */}
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isFromList ? 'bg-slate-50 text-slate-400' : 'bg-green-50 text-green-600'}`}>
                    {isFromList ? <Package size={18}/> : <MessageSquare size={18}/>}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{item.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{item.shopName}</p>
                  </div>
                </div>
                {isFromList && <div className="font-black text-green-600 text-sm">Rs {item.price}</div>}
              </div>

              {/* Interaction Panel */}
              {(isTypedCustom || isVoiceCustom) && (
                <div className="p-4 bg-[#f0f2f5] border-t border-slate-100 space-y-4">
                  
                  {/* Real Customer Voice Playback */}
                  {isVoiceCustom && (
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-black text-blue-600 ml-1">CUSTOMER VOICE</p>
                      <button 
                        onClick={() => playAudio('/path-to-customer-voice.mp3')} 
                        className="w-full flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-200 active:bg-blue-50"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          <Play size={14} fill="white" />
                        </div>
                        <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-1/2 h-full bg-blue-500" />
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Rider Voice Section */}
                  {isVoiceCustom && (
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-black text-green-600 ml-1">YOUR REPLY</p>
                      <button 
                        onPointerDown={() => startRecording(item.cartId)}
                        onPointerUp={stopRecording}
                        className={`w-full py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-3 border shadow-sm touch-none ${
                          recordingId === item.cartId ? 'bg-red-500 text-white animate-pulse border-red-600' : 'bg-white text-[#075e54] border-green-200'
                        }`}
                      >
                        <Mic size={18} /> {recordingId === item.cartId ? "RECORDING..." : "HOLD TO VOICE REPLY"}
                      </button>

                      {/* Your Voice Preview */}
                      {previews[item.cartId] && (
                        <div className="flex items-center gap-3 bg-[#dcf8c6] p-3 rounded-xl border border-green-300 mt-2 animate-in zoom-in-95">
                          <button 
                            onClick={() => playAudio(previews[item.cartId])} 
                            className="w-10 h-10 bg-[#128c7e] text-white rounded-full flex items-center justify-center shadow-md active:scale-90"
                          >
                            <Play size={16} fill="white" />
                          </button>
                          <div className="flex-1 font-bold text-[10px] text-green-800 uppercase italic">Preview My Voice</div>
                          <button onClick={() => {
                            const p = {...previews}; delete p[item.cartId]; setPreviews(p);
                          }} className="text-red-500 p-2"><Trash2 size={18}/></button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Reply for any Custom Item */}
                  <div className="flex gap-2">
                    <input type="text" placeholder="Type price or message..." className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-3 text-sm outline-none" />
                    <button className="bg-[#075e54] text-white p-3 rounded-full shadow-md active:scale-95"><Send size={16}/></button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex items-center justify-between shadow-2xl">
        <div className="leading-tight">
          <p className="text-[10px] font-black text-slate-400 uppercase">Estimated Bill</p>
          <p className="text-xl font-black text-slate-800">Rs {order.total}</p>
        </div>
        <button className="bg-[#128c7e] text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg active:scale-95">
          FINISH ORDER <CheckCircle size={18}/>
        </button>
      </div>
    </div>
  );
}