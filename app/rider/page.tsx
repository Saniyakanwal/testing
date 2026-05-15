"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Send, Package, MessageSquare, CheckCircle, Volume2, Trash2 } from 'lucide-react';

export default function RiderMobileAudio() {
  const [order, setOrder] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem('latestOrder');
    if (savedOrder) setOrder(JSON.parse(savedOrder));
  }, []);

  // --- Real Audio Logic for Mobile ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Mobile support ke liye specific audio type
      const options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/mp4'; // For Safari/iOS
      }

      mediaRecorder.current = new MediaRecorder(stream, options);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: options.mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Please allow Microphone access in your mobile settings!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      // Mic off karne ke liye tracks stop karna zaroori hai
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const playAudio = (url: string | null) => {
    if (!url) {
      alert("No audio file found!");
      return;
    }
    const audio = new Audio(url);
    audio.play().catch(e => alert("Audio Playback Error: Try clicking the button again."));
  };

  if (!order) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-24">
      <div className="bg-[#008069] p-4 text-white sticky top-0 z-20 flex items-center gap-3">
        <h1 className="font-bold">Rider Order Panel</h1>
      </div>

      <div className="p-4 space-y-4">
        {order.items.map((item: any) => (
          <div key={item.cartId} className="bg-white rounded-2xl shadow-sm border border-slate-200">
            {/* Item Info */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  {item.isCustom ? <MessageSquare size={18}/> : <Package size={18}/>}
                </div>
                <div className="font-bold text-sm text-slate-800">{item.name}</div>
              </div>
              {!item.isCustom && <div className="text-green-600 font-black">Rs {item.price}</div>}
            </div>

            {/* Voice Control for Custom Items */}
            {item.isCustom && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                
                {/* 1. Customer ki Voice (Simulation Button) */}
                <button 
                  onClick={() => alert("Customer's voice playback triggered")}
                  className="w-full flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200"
                >
                  <Play size={16} className="text-blue-500" fill="currentColor"/>
                  <span className="text-xs font-bold text-slate-500 uppercase">Listen Customer Voice</span>
                </button>

                {/* 2. Rider Recording */}
                <div className="space-y-3">
                  <button 
                    onPointerDown={startRecording}
                    onPointerUp={stopRecording}
                    className={`w-full py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border shadow-sm transition-all active:scale-95 touch-none ${
                      isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-[#008069] border-[#008069]'
                    }`}
                  >
                    <Mic size={18} /> {isRecording ? "RECORDING..." : "HOLD TO RECORD"}
                  </button>

                  {/* Rider Preview (Apni Voice Sun'na) */}
                  {audioURL && (
                    <div className="flex items-center gap-3 bg-green-100 p-3 rounded-xl border border-green-200">
                      <button 
                        onClick={() => playAudio(audioURL)}
                        className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center shadow-md"
                      >
                        <Play size={16} fill="white" />
                      </button>
                      <div className="flex-1 text-[10px] font-black text-green-800">PREVIEW YOUR RECORDING</div>
                      <button onClick={() => setAudioURL(null)} className="text-red-500"><Trash2 size={16}/></button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex items-center justify-between">
        <p className="font-black text-lg">Rs {order.total}</p>
        <button className="bg-[#008069] text-white px-8 py-3 rounded-xl font-bold shadow-lg">FINISH ORDER</button>
      </div>
    </div>
  );
}