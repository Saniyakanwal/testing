"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, Mic, Send, Store, Plus, 
  ChevronLeft, ChevronRight, X, Trash2, CheckCircle2 
} from 'lucide-react';

const SHOPS_DATA = [
  { id: 1, name: "Sabzi Mandi", category: "Vegetables", items: [{ id: 101, name: "Potato", price: 80, unit: "1 kg", img: "https://cdn-icons-png.flaticon.com/128/1135/1135544.png" }] },
  { id: 2, name: "Daily Dairy", category: "Dairy", items: [{ id: 301, name: "Milk", price: 210, unit: "1 Ltr", img: "https://cdn-icons-png.flaticon.com/128/2405/2405479.png" }] },
];

export default function CustomerPage() {
  const router = useRouter();
  
  // States
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [customRequest, setCustomRequest] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // Audio Recording Refs for Real Voice Capture
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Functions
  const addToCart = (product: any, shopName: string) => {
    setCart([...cart, { ...product, shopName, cartId: Math.random() }]);
  };

  const removeFromCart = (cartId: number) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // Asli Voice capturing function
  const startRecordingVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob); // Converts audio file to Base64 String
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          // Voice custom item cart mein append ho raha hai design kharab kiye bagair
          setCart((prevCart) => [
            ...prevCart,
            { 
              id: Date.now(), 
              name: "Voice Note Order 🎙️", 
              price: 0, 
              unit: "Custom Request", 
              shopName: selectedShop.name, 
              cartId: Math.random(),
              isCustom: true,
              audioData: base64Audio // Yeh line ab Rider dashboard par chalegi!
            }
          ]);
        };
        // Stop camera/mic tracks safely
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Mic permission block hai! Please click allow mic.");
    }
  };

  const stopRecordingVoice = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const addCustomToCart = (shopName: string, customName?: string) => {
    const itemName = customName || customRequest;
    if (!itemName.trim()) return;

    setCart([...cart, { 
      id: Date.now(), 
      name: itemName, 
      price: 0, 
      unit: "Custom Request", 
      shopName, 
      cartId: Math.random(),
      isCustom: true 
    }]);
    setCustomRequest("");
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const groupedCart = cart.reduce((acc: any, item: any) => {
    (acc[item.shopName] = acc[item.shopName] || []).push(item);
    return acc;
  }, {});
 // Send Data to Bot on Order Place (Fixed Integration)
  const handlePlaceOrder = async () => {
    setIsOrdering(true);
    
    const orderId = "#ORD-" + Math.floor(1000 + Math.random() * 9000);
    const orderData = {
      orderId: orderId,
      items: cart,
      total: total,
    };
    
    localStorage.setItem('latestOrder', JSON.stringify(orderData));
    
    // ⚡ SANIYA FIX: Cart ke saare items ko aik text string mein convert karna
    // Taake Express bot aur Gemini isay poori tarah samajh sakein
    const itemsText = cart.map(item => {
      if (item.name.includes("Voice Note Order")) {
        // Agar voice note hai, toh bhejte hain ke custom voice aayi hai 
        // (Base64 audio aap localStorage se rider side par direct access kar sakti hain)
        return "Voice request generated";
      }
      return `${item.name} (${item.unit || '1 unit'})`;
    }).join(", ");

    const finalPayload = {
      text: `Order ${orderId}: ${itemsText}. Total bill is Rs ${total}`,
      action: "customer_submit",
      ...orderData
    };
    
    // ---- AAPKI VERCEL BOT LINK INTEGRATION ----
    try {
      const response = await fetch("https://voice-ai-bot-theta.vercel.app/api/ai-processor", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(finalPayload), // Ab isme strict 'text' field mojood hai!
      });
      
      const resData = await response.json();
      console.log("Bot Response successfully received:", resData);
    } catch (error) {
      console.error("Bot API Error:", error);
    }
    
    setTimeout(() => { 
      router.push('/rider'); 
    }, 1500);
  };
  // UI for Order Success
  if (isOrdering) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce text-green-600 shadow-lg">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Order Placed!</h2>
        <p className="text-slate-500 mt-2">Opening Rider Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-5 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          {selectedShop && (
            <button onClick={() => setSelectedShop(null)} className="p-2 bg-slate-100 rounded-full active:scale-90 transition-all">
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            {selectedShop ? selectedShop.name : "Marketplace"}
          </h1>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-slate-900 text-white rounded-2xl shadow-xl active:scale-90 transition-all">
          <ShoppingBag size={22} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
              {cart.length}
            </span>
          )}
        </button>
      </nav>

      <main className="max-w-xl mx-auto p-5">
        {!selectedShop ? (
          /* --- SHOP LIST --- */
          <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-2">Select a Shop</h2>
            {SHOPS_DATA.map(shop => (
              <div key={shop.id} onClick={() => setSelectedShop(shop)} className="bg-white p-6 rounded-[2.5rem] flex justify-between items-center shadow-sm hover:shadow-md cursor-pointer border border-slate-100 group transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white"><Store size={30}/></div>
                  <div>
                    <h3 className="font-black text-xl text-slate-800">{shop.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{shop.category}</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-full group-hover:bg-green-500 group-hover:text-white transition-all"><ChevronRight size={18}/></div>
              </div>
            ))}
          </div>
        ) : (
          /* --- PRODUCT LIST & CUSTOM INPUT --- */
          <div className="animate-in slide-in-from-right duration-300 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {selectedShop.items.map((item: any) => (
                <div key={item.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4"><img src={item.img} className="w-12 h-12 object-contain" alt="" /></div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mb-4 tracking-tighter uppercase">Rs {item.price} • {item.unit}</p>
                  <button onClick={() => addToCart(item, selectedShop.name)} className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-widest active:scale-95 transition-all">ADD ITEM</button>
                </div>
              ))}
            </div>

            {/* --- VOICE & TEXT INPUT BOX --- */}
            <div className="bg-white p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-inner">
              <div className="mb-4 text-center">
                <h3 className="font-black text-slate-800 text-lg">Special Request?</h3>
                <p className="text-xs text-slate-500">Type or hold mic to record items</p>
              </div>
              
              <div className="space-y-3">
                {/* Text Box */}
                <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-1 border border-slate-200 focus-within:border-slate-900 transition-all">
                  <input 
                    type="text" 
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                    placeholder="e.g. 2kg Sugar..." 
                    className="flex-1 bg-transparent text-sm outline-none py-3 text-slate-800"
                  />
                  <button 
                    onClick={() => addCustomToCart(selectedShop.name)}
                    className="p-2 bg-slate-900 text-white rounded-xl active:scale-90 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                {/* Voice Button Connected to Fixed Audio Logic */}
                <button 
                  onMouseDown={startRecordingVoice}
                  onMouseUp={stopRecordingVoice}
                  onTouchStart={startRecordingVoice}
                  onTouchEnd={stopRecordingVoice}
                  className={`w-full py-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-4 border transition-all duration-300 relative overflow-hidden ${
                    isRecording 
                    ? "bg-red-50 border-red-300 text-red-600 scale-95" 
                    : "bg-blue-50 border-blue-100 text-blue-600"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isRecording ? "bg-red-600 text-white animate-pulse" : "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  }`}>
                    <Mic size={20} />
                  </div>
                  <span className="uppercase tracking-widest text-xs font-black">
                    {isRecording ? "Recording Now..." : "Hold to Record Voice"}
                  </span>
                </button>
                
                {isRecording && (
                   <p className="text-[10px] text-center text-red-500 font-bold animate-bounce uppercase tracking-tighter">
                     Speak clearly • Release to save
                   </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl" onClick={() => setIsCartOpen(false)} />
          <div className="relative bg-white w-full rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-slate-900">Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-3 bg-slate-100 rounded-full text-slate-500"><X size={24}/></button>
            </div>

            <div className="space-y-6 mb-8">
              {cart.length === 0 ? <div className="text-center py-10 font-bold text-slate-300 tracking-widest">NO ITEMS ADDED</div> : 
                Object.keys(groupedCart).map(shop => (
                  <div key={shop} className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-green-600 uppercase mb-4 tracking-widest flex items-center gap-2">
                       <Store size={14}/> {shop}
                    </p>
                    {groupedCart[shop].map((item: any) => (
                      <div key={item.cartId} className="flex justify-between items-center mb-3 bg-white p-4 rounded-2xl shadow-sm">
                        <span className={`text-sm font-bold ${item.isCustom ? 'text-blue-600 italic' : 'text-slate-800'}`}>
                          {item.name}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-xs text-slate-900">{item.price > 0 ? `Rs ${item.price}` : 'TBD'}</span>
                          <button onClick={() => removeFromCart(item.cartId)} className="text-red-400 p-1 active:scale-75 transition-all"><Trash2 size={18}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              }
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-6 space-y-4">
                <div className="flex justify-between items-center px-4">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Total Bill</span>
                  <span className="text-3xl font-black text-slate-900">Rs {total}</span>
                </div>
                <button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-green-100 active:scale-95 transition-all"
                >
                  PLACE ORDER
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Checkout Button */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md">
          <button onClick={() => setIsCartOpen(true)} className="w-full bg-slate-900 text-white p-5 rounded-[2.2rem] flex justify-between items-center shadow-2xl active:scale-95 transition-all">
            <span className="font-black text-sm flex items-center gap-3">
               <ShoppingBag size={18} className="text-green-500" /> {cart.length} ITEMS
            </span>
            <span className="bg-white/10 px-5 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase">
              View Cart • Rs {total}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}