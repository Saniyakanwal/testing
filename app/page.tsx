"use client";
import React, { useState } from 'react';
import { ShoppingCart, Mic, Send, Store, Plus, Search } from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: "Vegetables", shop: "Sabzi Mandi", items: [{ id: 101, name: "Potato", price: 80, unit: "1 kg", img: "https://cdn-icons-png.flaticon.com/128/1135/1135544.png" }] },
  { id: 2, name: "Fruits", shop: "Fresh Fruit Co.", items: [{ id: 201, name: "Apple", price: 250, unit: "1 kg", img: "https://cdn-icons-png.flaticon.com/128/415/415733.png" }] },
  { id: 3, name: "Dairy", shop: "Daily Dairy", items: [{ id: 301, name: "Milk", price: 210, unit: "1 Ltr", img: "https://cdn-icons-png.flaticon.com/128/2405/2405479.png" }] },
];

export default function CustomerPage() {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any, shopName: string) => {
    setCart([...cart, { ...product, shopName }]);
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Navbar: Responsive width */}
      <nav className="sticky top-0 z-50 bg-white border-b px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black text-green-600 tracking-tight">FAST-DROP</h1>
          <div className="relative p-2 bg-green-50 rounded-full">
            <ShoppingCart size={22} className="text-green-700" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for fruits, veg or grocery..." 
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
          />
        </div>

        {CATEGORIES.map((cat) => (
          <section key={cat.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Shop Header */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-white flex justify-between items-center border-b">
              <div className="flex items-center gap-2">
                <Store size={20} className="text-green-600" />
                <div>
                  <h2 className="font-bold text-gray-800 leading-none">{cat.shop}</h2>
                  <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">{cat.name}</span>
                </div>
              </div>
            </div>

            {/* Products: Grid for responsiveness */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cat.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 group hover:bg-green-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:scale-105 transition-transform">
                      <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.unit} • Rs {item.price}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart(item, cat.shop)}
                    className="p-2 bg-white text-green-600 rounded-full shadow-md hover:bg-green-600 hover:text-white transition-all active:scale-90"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Voice/Type UI */}
            <div className="p-4 bg-slate-50 flex items-center gap-2 border-t">
              <div className="flex-1 bg-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-inner border">
                <input 
                  type="text" 
                  placeholder="Kuch extra mangwana hai?" 
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <button title="Voice Message" className="text-blue-500 hover:bg-blue-50 p-1 rounded-full"><Mic size={18} /></button>
              </div>
              <button className="p-3 bg-green-600 text-white rounded-xl shadow-lg active:scale-95"><Send size={18} /></button>
            </div>
          </section>
        ))}
      </main>

      {/* Responsive Bottom Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t z-50">
          <div className="max-w-2xl mx-auto">
            <button className="w-full bg-black text-white py-4 rounded-2xl font-bold flex justify-between px-6 shadow-2xl items-center hover:bg-gray-800 transition-all">
              <span className="flex flex-col items-start">
                <small className="text-[10px] text-gray-400 font-normal">Total Amount</small>
                Rs {total}
              </span>
              <span className="flex items-center gap-2">Place Order <Send size={16}/></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}