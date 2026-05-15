"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mic, Play, Bike, CheckCircle2, 
  Volume2, RefreshCw, Trash2, Headphones, Square 
} from 'lucide-react';

export default function RiderAbsoluteFixPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  
  // Rider Audio Recording States
  const [isRecordingRider, setIsRecordingRider] = useState<number | null>(null);
  const [riderAudioURLs, setRiderAudioURLs] = useState<{[key: number]: string}>({});
  const [riderBase64Audio, setRiderBase64Audio] = useState<{[key: number]: string}>({}); // 🔥 NEW: Base64 Storage for Backend
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('latestOrder');
    if (data) setOrder(JSON.parse(data));
  }, []);

  // 1. Customer Voice Play Function
  const playCustomerVoice = (item: any) => {
    if (item.audioData) {
      const audio = new Audio(item.audioData);
      audio.play().catch(e => console.error("Audio play error:", e));
    } else {
      window.speechSynthesis.cancel(); 
      const cleanText = item.name.replace("Voice Note Order 🎙️", "");
      const utterance = new SpeechSynthesisUtterance(cleanText || "Custom Voice Request");
      utterance.lang = 'en-US'; 
      window.speechSynthesis.speak(utterance);
    }
  };

  // 2. Rider Voice Response Recording Logic (Fixed with Base64 Conversion)
  const startRiderRecording = async (index: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob); // Only for local UI playing
        
        // Local preview updates
        setRiderAudioURLs(prev => ({ ...prev, [index]: audioUrl }));

        // 🔥 CRITICAL FIX: Convert Rider blob to Base64 text string for Vercel/Express
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setRiderBase64Audio(prev => ({ ...prev, [index]: base64Audio }));
          
          // Sync with active state memory
          const updatedItems = [...order.items];
          updatedItems[index].riderVoiceFile = base64Audio; 
          setOrder({ ...order, items: updatedItems });
        };
      };

      mediaRecorder.start();
      setIsRecordingRider(index);
    } catch (err) {
      alert("Mic access nahi mila! Please check settings or permissions.");
      console.error(err);
    }
  };

  const stopRiderRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecordingRider(null);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // 3. Play Rider Local Audio Preview
  const playOwnRecordedVoice = (audioUrl: string) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.error("Error playing rider voice:", e));
  };

  // 4. Order Confirm & Redirect (Fixed Payload with Required 'text' wrapper)
  const handleConfirmOrder = async () => {
    // Rider responses ko plain context text mein badalna taake Gemini direct read kar sake
    const riderConversationsText = order.items.map((item: any, i: number) => {
      const status = riderBase64Audio[i] ? "Rider sent voice response" : "No rider response yet";
      return `Product: ${item.name} from ${item.shopName} (${status})`;
    }).join(" | ");

    const finalConvoData = {
      // ⚡ VERCEL ROUTE EXPECTATION FIX: Is key ka hona lazmi hai bridge ko chalane ke liye
      text: `Rider closed Order ${order.orderId}. Context: ${riderConversationsText}`,
      action: "rider_submit", 
      orderId: order.orderId,
      totalBill: order.total,
      conversation: order.items.map((item: any, i: number) => ({
        shopName: item.shopName,
        itemName: item.name,
        isCustom: item.isCustom || false,
        customerVoiceData: item.audioData || null,   
        riderVoiceResponse: riderBase64Audio[i] || null, // 🔥 Pass hotay hue ab clean Base64 string jayegi, temporary blob URL nahi!
        riderTextResponse: item.riderTextReply || null 
      }))
    };

    // ---- LIVE SYNC PROCESSOR ----
    try {
      const response = await fetch("https://voice-ai-bot-theta.vercel.app/api/ai-processor", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalConvoData),
      });
      
      const resJSON = await response.json();
      console.log("Rider Sync Success Data:", resJSON);
      alert("Convo analyzed by Bot! Shop items listing updated.");
    } catch (error) {
      console.error("Finalization Bot API Error:", error);
    }

    localStorage.removeItem('latestOrder');
    setOrder(null);
    router.push('/'); 
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <RefreshCw className="text-green-500 animate-spin mb-4" size={32} />
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Waiting for Customer Order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-32">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white border-b px-6 py-5 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-xl text-white shadow-md"><Bike size={20} /></div>
          <h1 className="text-lg font-black italic tracking-tight">RIDER PORTAL</h1>
        </div>
        <button onClick={() => { localStorage.removeItem('latestOrder'); setOrder(null); }} className="text-slate-300 hover:text-red-500"><Trash2 size={20}/></button>
      </nav>

      <main className="p-6 max-w-md mx-auto space-y-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Received Order Items</p>

        {order.items.map((item: any, i: number) => {
          const isVoiceRequest = item.isCustom && (item.name.includes("🎙️") || item.audioData);

          return (
            <div key={i} className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-900 text-white text-[8px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-widest">
                {item.shopName}
              </div>

              <div className="mb-4 pt-2">
                <h3 className={`text-lg font-black leading-tight ${item.isCustom ? 'text-blue-600' : 'text-slate-800'}`}>
                  {item.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                  {item.isCustom ? "Special Request" : `Rs ${item.price || 'Fixed'} • Added from List`}
                </p>
              </div>

              {/* CUSTOMER VOICE CONTAINER */}
              {isVoiceRequest && (
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                  <button 
                    onClick={() => playCustomerVoice(item)}
                    className="w-full bg-blue-50 text-blue-600 p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all"
                  >
                    <Volume2 size={16} /> Customer Ki Voice Suno
                  </button>

                  {/* Rider Voice Record Actions */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Your Voice Response</p>
                    <div className="flex gap-2">
                      {isRecordingRider === i ? (
                        <button 
                          onClick={stopRiderRecording}
                          className="flex-1 p-4 bg-red-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse shadow-lg shadow-red-100"
                        >
                          <Square size={16} /> Stop Recording
                        </button>
                      ) : (
                        <button 
                          onClick={() => startRiderRecording(i)}
                          className="flex-1 p-4 bg-green-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                          <Mic size={16} /> Start Record Reply
                        </button>
                      )}

                      {riderAudioURLs[i] && (
                        <button 
                          onClick={() => playOwnRecordedVoice(riderAudioURLs[i])}
                          className="bg-blue-600 text-white px-5 rounded-2xl flex items-center justify-center active:scale-95 shadow-md shadow-blue-100"
                          title="Apni Awaz Suno"
                        >
                          <Play size={16} fill="currentColor" />
                        </button>
                      )}
                    </div>
                    {riderBase64Audio[i] && (
                      <p className="text-[10px] text-green-600 font-bold italic ml-1">✓ Your audio response converted & saved successfully!</p>
                    )}
                  </div>
                </div>
              )}

              {!item.isCustom && (
                <div className="mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">✓ Fixed Item (No Actions Needed)</p>
                </div>
              )}

            </div>
          );
        })}
      </main>

      <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto">
        <button 
          onClick={handleConfirmOrder}
          className="w-full bg-slate-900 text-white py-5 rounded-[2.2rem] font-black shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm active:scale-95 transition-all"
        >
          <CheckCircle2 size={20} className="text-green-500" /> Confirm & Send Responses
        </button>
      </div>
    </div>
  );
}