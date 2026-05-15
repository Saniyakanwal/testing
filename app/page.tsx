"use client";
import React, { useState } from 'react';
import { ShoppingCart, Mic, Send, Store, Plus, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const SHOPS_DATA = [
  { 
    id: 1, 
    name: "Sabzi Mandi", 
    category: "Vegetables", 
    color: "bg-green-500",
    items: [
      { id: 101, name: "Potato", price: 80, unit: "1 kg", img: "https://cdn-icons-png.flaticon.com/128/1135/1135544.png" },
      { id: 102, name: "Tomato", price: 120, unit: "1 kg", img: "https://cdn-icons-png.flaticon.com/128/1202/1202125.png" }
    ] 
  },
  { 
    id: 2, 
    name: "Fresh Fruit Co.", 
    category: "Fruits", 
    color: "bg-orange-500",
    items: [
      { id: 201, name: "Apple", price: 250, unit: "1 kg", img: "https://cdn-icons-png.flaticon.com/128/415/415733.png" }
    ] 
  },
  { 
    id: 3, 
    name: "Daily Dairy", 
    category: "Dairy", 
    color: "bg-blue-500",
    items: [
      { id: 301, name: "Milk", price: 210, unit: "1 Ltr", img: "https://cdn-icons-png.flaticon.com/128/2405/2405479.png" }
    ] 
  },
];

export default function CustomerPage() {
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any, shopName: string) => {
    setCart([...cart, { ...product, shopName }]);
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b px-4 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            {selectedShop && (
              <button onClick={() => setSelectedShop(null)} className="p-1 hover:bg-gray-100 rounded-full">
                <ChevronLeft size={24} />
              </button>
            )}
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {selectedShop ? selectedShop.name : "Marketplace"}
            </h1>
          </div>
          <div className="relative bg-black p-2 rounded-xl text-white shadow-lg">
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4">
        {!selectedShop ? (
          /* --- SHOP LIST VIEW --- */
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Assalam-o-Alaikum! 👋</h2>
              <p className="text-slate-500 text-sm">Aaj kya mangwana hai?</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {SHOPS_DATA.map((shop) => (
                <div 
                  key={shop.id}
                  onClick={() => setSelectedShop(shop)}
                  className="group relative bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all cursor-pointer flex justify-between items-center overflow-hidden"
                >
                  <div className="flex items-center gap-4 z-10">
                    <div className={`w-14 h-14 ${shop.color} rounded-2xl flex items-center justify-center text-white shadow-inner`}>
                      <Store size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{shop.name}</h3>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{shop.category}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-green-500 transition-colors" />
                  <div className="absolute right-0 top-0 h-full w-1 bg-transparent group-hover:bg-green-500 transition-all" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* --- PRODUCT DETAIL VIEW --- */
          <div className="animate-in slide-in-from-right duration-300 space-y-6">
            <div className="relative">
               <Search className="absolute left-3 top-3 text-gray-400" size={20} />
               <input 
                 type="text" 
                 placeholder={`Search in ${selectedShop.name}...`} 
                 className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedShop.items.map((item: any) => (
                <div key={item.id} className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl p-2 mb-3 group-hover:scale-110 transition-transform">
                    <img src={item.img} alt="" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                  <p className="text-xs text-slate-400 mb-3">{item.unit} • Rs {item.price}</p>
                  <button 
                    onClick={() => addToCart(item, selectedShop.name)}
                    className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-md"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {/* Voice & Custom Request Section */}
            <div className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2">Item nahi mil raha?</h4>
              <p className="text-xs text-slate-500 mb-4">Humein bataein, hum dhoond lenge!</p>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-3 border">
                  <input 
                    type="text" 
                    placeholder="Type missing item..." 
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <Send size={18} className="text-slate-400" />
                </div>
                <button className="flex items-center justify-center gap-2 w-full py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold border border-blue-100 active:scale-95 transition-all">
                  <Mic size={20} /> Record Voice Note
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t z-50">
          <div className="max-w-2xl mx-auto">
            <button className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold flex justify-between items-center shadow-xl shadow-green-200">
              <div className="flex flex-col items-start">
                <span className="text-[10px] uppercase opacity-70">Total Payable</span>
                <span className="text-lg leading-none">Rs {total}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                Place Order <ChevronRight size={18} />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}