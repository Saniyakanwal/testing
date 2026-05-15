"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Routing ke liye
import { ShoppingBag, Mic, Send, Store, Plus, ChevronLeft, ChevronRight, X, Trash2, CheckCircle2 } from 'lucide-react';

const SHOPS_DATA = [
  { id: 1, name: "Sabzi Mandi", category: "Vegetables", items: [{ id: 101, name: "Potato", price: 80, unit: "1 kg", img: "https://cdn-icons-png.flaticon.com/128/1135/1135544.png" }] },
  { id: 2, name: "Daily Dairy", category: "Dairy", items: [{ id: 301, name: "Milk", price: 210, unit: "1 Ltr", img: "https://cdn-icons-png.flaticon.com/128/2405/2405479.png" }] },
];

export default function CustomerPage() {
  const router = useRouter();
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false); // Loading state

  const addToCart = (product: any, shopName: string) => {
    setCart([...cart, { ...product, shopName, cartId: Math.random() }]);
  };

  const removeFromCart = (cartId: number) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  // Grouping for Cart Display
  const groupedCart = cart.reduce((acc: any, item: any) => {
    (acc[item.shopName] = acc[item.shopName] || []).push(item);
    return acc;
  }, {});

  const handlePlaceOrder = () => {
    setIsOrdering(true);
    
    // Step 1: Data save karna rider ke liye
    const orderData = {
      orderId: "#ORD-" + Math.floor(1000 + Math.random() * 9000),
      items: cart,
      total: total,
      status: "Processing"
    };
    localStorage.setItem('latestOrder', JSON.stringify(orderData));

    // Step 2: Chota sa delay real feel ke liye, phir direct Rider page par transfer
    setTimeout(() => {
      router.push('/rider'); 
    }, 1500);
  };

  if (isOrdering) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Order Confirmed!</h2>
        <p className="text-slate-500 mt-2">Connecting you with the nearest rider...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-5 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {selectedShop && (
            <button onClick={() => setSelectedShop(null)} className="p-2 bg-slate-100 rounded-full">
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-black tracking-tight">{selectedShop ? selectedShop.name : "Marketplace"}</h1>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-slate-900 text-white rounded-2xl shadow-xl active:scale-90 transition-all">
          <ShoppingBag size={22} />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white text-[10px] font-bold flex items-center justify-center">{cart.length}</span>}
        </button>
      </nav>

      <main className="max-w-xl mx-auto p-5">
        {!selectedShop ? (
          <div className="grid gap-4">
            <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest px-2">Select Shop</h2>
            {SHOPS_DATA.map(shop => (
              <div key={shop.id} onClick={() => setSelectedShop(shop)} className="bg-white p-6 rounded-[2.5rem] flex justify-between items-center shadow-sm hover:shadow-md cursor-pointer border border-slate-100 group transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-green-600 rounded-3xl flex items-center justify-center text-white"><Store size={32}/></div>
                  <div>
                    <h3 className="font-black text-xl text-slate-800">{shop.name}</h3>
                    <p className="text-sm font-bold text-green-600 uppercase tracking-tighter">{shop.category}</p>
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-full group-hover:bg-slate-900 group-hover:text-white transition-all"><ChevronRight size={20}/></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {selectedShop.items.map((item: any) => (
              <div key={item.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4"><img src={item.img} className="w-12 h-12 object-contain" alt="" /></div>
                <h4 className="font-bold text-slate-800">{item.name}</h4>
                <p className="text-xs text-slate-400 mb-4">Rs {item.price} / {item.unit}</p>
                <button onClick={() => addToCart(item, selectedShop.name)} className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase active:scale-95 transition-all">Add to Cart</button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative bg-white w-full rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black">My Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-3 bg-slate-100 rounded-full"><X size={24}/></button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto mb-8 pr-2">
              {cart.length === 0 ? <p className="text-center text-slate-400 py-10">Cart is empty</p> : 
                Object.keys(groupedCart).map(shop => (
                  <div key={shop} className="mb-6">
                    <p className="text-[10px] font-black text-green-600 uppercase mb-3 tracking-widest">{shop}</p>
                    {groupedCart[shop].map((item: any) => (
                      <div key={item.cartId} className="flex justify-between items-center mb-3 bg-slate-50 p-4 rounded-3xl">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-sm">Rs {item.price}</span>
                          <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 p-1"><Trash2 size={18}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              }
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-6 px-2">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                <span className="text-3xl font-black">Rs {total}</span>
              </div>
              <button 
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
                className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-green-100 active:scale-95 transition-all disabled:opacity-50"
              >
                PLACE ORDER NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Button */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
          <button onClick={() => setIsCartOpen(true)} className="w-full bg-slate-900 text-white p-5 rounded-[2rem] flex justify-between items-center shadow-2xl">
            <span className="font-black flex items-center gap-2"><Plus size={18}/> {cart.length} ITEMS</span>
            <span className="bg-white/10 px-4 py-2 rounded-2xl text-xs font-bold tracking-tighter uppercase">View Cart • Rs {total}</span>
          </button>
        </div>
      )}
    </div>
  );
}