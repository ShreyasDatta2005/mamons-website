import { useState, useEffect } from 'react';
import { useCartStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [user, setUser] = useState<any>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% GST on nuts mostly
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login first to place an order.");
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: items,
        totalAmount: total,
        status: 'pending',
        shippingAddress: 'Pending Address...',
        createdAt: Date.now()
      });
      clearCart();
      alert("Order placed successfully!");
      navigate('/dashboard');
    } catch (err: any) {
      alert("Error placing order: " + err.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-24 px-4 bg-[#FDFBF7]">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 text-[#A0522D] bg-[#F2EDE4]">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold font-serif text-[#2D3621] mb-4">Your cart is empty</h2>
        <p className="text-[#8B8B8B] mb-8 max-w-md text-center text-sm">Looks like you haven't added anything to your cart yet. Discover our premium nuts and dry fruits.</p>
        <Link to="/shop" className="bg-[#556B2F] hover:bg-[#2D3621] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full flex-grow">
      <h1 className="text-4xl font-bold font-serif text-[#2D3621] mb-10">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow">
          <ul className="divide-y divide-[#E8E2D6] border-t border-b border-[#E8E2D6]">
            {items.map((item) => (
              <li key={item.id} className="py-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="shrink-0 w-32 h-32 rounded-2xl overflow-hidden shadow-sm relative">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-2 drop-shadow-md" />
                </div>
                
                <div className="flex-grow flex flex-col justify-between h-full space-y-4 sm:space-y-0 text-center sm:text-left">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#2D3621]">{item.name}</h3>
                    <p className="text-xs text-[#8B8B8B] mt-1 uppercase tracking-widest font-bold">{item.category}</p>
                  </div>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-auto">
                    <div className="flex items-center border border-[#E8E2D6] rounded-full overflow-hidden bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 text-[#556B2F] hover:bg-[#F2EDE4] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-bold text-[#3D3D3D] text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-[#556B2F] hover:bg-[#F2EDE4] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-[#A0522D] hover:bg-[#F2EDE4] rounded-full transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-[#2D3621]">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-[10px] text-[#8B8B8B] mt-1">${item.price.toFixed(2)} each</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D6] shadow-lg sticky top-24">
            <h2 className="text-xl font-bold font-serif text-[#2D3621] mb-6">Order Summary</h2>
            
            <dl className="space-y-4 text-sm text-[#5C5C5C] mb-6">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-bold text-[#3D3D3D]">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Taxes (5% GST)</dt>
                <dd className="font-bold text-[#3D3D3D]">${tax.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="font-bold text-[#3D3D3D]">Calculated at checkout</dd>
              </div>
              <div className="border-t border-[#E8E2D6] pt-4 flex justify-between items-center text-lg">
                <dt className="font-bold text-[#2D3621]">Total estimated</dt>
                <dd className="font-bold text-[#A0522D]">${total.toFixed(2)}</dd>
              </div>
            </dl>
            
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-[#556B2F] hover:bg-[#2D3621] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-50"
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            <div className="mt-4 text-center">
              <Link to="/shop" className="text-[10px] text-[#A0522D] hover:text-[#556B2F] font-bold uppercase tracking-widest underline transition-colors">
                or Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
