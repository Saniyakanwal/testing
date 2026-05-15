"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Send, Package, MessageSquare, CheckCircle, Trash2 } from 'lucide-react';

export default function RiderMobileFixed() {
  const [order, setOrder] = useState<any>(null);
  const [recordingId, setRecordingId] = useState<number | null>(null);
  const [previews, setPreviews] = useState<{ [key: number]: string }>({}); 
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const savedOrder = localStorage.getItem('latestOrder');
    if (savedOrder) setOrder(JSON.parse(savedOrder));
  }, []);

  // --- Mobile Audio Fix: Unlock Browser Audio ---
  const unlockAudio = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };

  const startRecording = async (itemId: number) => {
    unlockAudio(); // Har baar record se pehle unlock call karein
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Mobile compatibility check
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      
      mediaRecorder.current = new MediaRecorder(stream, { mimeType });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setPreviews(prev => ({ ...prev, [itemId]: url }));
      };

      mediaRecorder.current.start();
      setRecordingId(itemId);
    } catch (err) {
      alert("Please check your Mobile Settings -> Site Settings -> Microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recordingId !== null) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setRecordingId(null);
    }
  };

  // --- Real Audio Player Logic ---
  const playAudio = (url: string) => {
    if (!url) return;
    const audio = new Audio();
    audio.src = url;
    audio.load(); // Mobile Safari ke liye lazmi hai
    
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Playback blocked:", error);
        // Agar block ho jaye tou dobara user click ka wait karein
        alert("Click the Play button again to listen.");
      });
    }
  };

  if (!order) return <div className="p-10 text-center font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24 font-sans">
      <div className="bg-[#075e54] p-4 text-white sticky top-0 z-20 shadow-md">
        <h1 className="font-bold text-sm uppercase">Order Management</h1>
      </div>

      <div className="p-4 space-y-4">
        {order.items.map((item: any) => {
          const isFromList = !item.isCustom;
          const isVoiceCustom = item.isCustom && item.name.includes("Voice Note");

          return (
            <div key={item.cartId} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Item Info */}
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isFromList ? 'bg-slate-50 text-slate-400' : 'bg-green-50 text-green-600'}`}>
                    {isFromList ? <Package size={18}/> : <MessageSquare size={18}/>}
                  </div>
                  <h3 className="font-bold text-sm text-slate-800">{item.name}</h3>
                </div>
                {isFromList && <div className="font-black text-green-600">Rs {item.price}</div>}
              </div>

              {/* Interaction Panel */}
              {item.isCustom && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-4">
                  
                  {/* Customer Voice Section */}
                  {isVoiceCustom && (
                    <div className="bg-white p-3 rounded-xl border border-blue-200">
                      <p className="text-[9px] font-black text-blue-500 mb-2 uppercase tracking-widest">Customer Voice Note</p>
                      <button 
                        onClick={() => playAudio('/path-to-customer-audio.mp3')} 
                        className="flex items-center gap-3 w-full"
                      >
                        <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          <Play size={16} fill="white" />
                        </div>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                          <div className="w-1/3 h-full bg-blue-500 rounded-full" />
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Rider Recording Section */}
                  {isVoiceCustom && (
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-green-600 mb-1 uppercase tracking-widest">Your Voice Reply</p>
                      <button 
                        onPointerDown={() => startRecording(item.cartId)}
                        onPointerUp={stopRecording}
                        className={`w-full py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border touch-none ${
                          recordingId === item.cartId ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-[#075e54] border-[#075e54]'
                        }`}
                      >
                        <Mic size={18} /> {recordingId === item.cartId ? "RECORDING..." : "HOLD TO RECORD"}
                      </button>

                      {/* Rider Voice Preview (Self-Listen) */}
                      {previews[item.cartId] && (
                        <div className="flex items-center gap-3 bg-[#dcf8c6] p-3 rounded-xl border border-green-300">
                          <button 
                            onClick={() => playAudio(previews[item.cartId])} 
                            className="w-10 h-10 bg-[#128c7e] text-white rounded-full flex items-center justify-center shadow-md active:scale-90"
                          >
                            <Play size={16} fill="white" />
                          </button>
                          <span className="text-[10px] font-black text-green-800 uppercase flex-1">Listen My Recording</span>
                          <button onClick={() => {
                            const p = {...previews}; delete p[item.cartId]; setPreviews(p);
                          }} className="text-red-500"><Trash2 size={18}/></button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input type="text" placeholder="Type price or note..." className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm outline-none" />
                    <button className="bg-[#075e54] text-white p-2.5 rounded-full"><Send size={16}/></button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex items-center justify-between">
        <p className="text-xl font-black">Rs {order.total}</p>
        <button className="bg-[#128c7e] text-white px-8 py-3 rounded-xl font-black shadow-lg uppercase text-xs tracking-widest">Finish Order</button>
      </div>
    </div>
  );
}