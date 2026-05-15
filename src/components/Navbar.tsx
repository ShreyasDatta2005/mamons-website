import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Menu } from 'lucide-react';
import { useCartStore } from '../store';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const cartItems = useCartStore((state) => state.items);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth);
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="h-20 px-4 sm:px-10 border-b border-[#E8E2D6] flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Mamon's Logo" className="h-12 w-auto object-contain" onError={(e) => {
            // Fallback if user hasn't uploaded logo yet
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }} />
          <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-[#452b11] uppercase hidden">Mamon's</span>
        </Link>
        <div className="hidden md:flex gap-8 ml-8 text-sm font-medium uppercase tracking-widest text-[#556B2F]">
          <Link to="/" className="hover:text-[#A0522D] transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-[#A0522D] transition-colors">The Collection</Link>
          <Link to="/distributor" className="hover:text-[#A0522D] transition-colors">Distributor Hub</Link>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <Link to="/cart" className="relative p-2 text-[#556B2F] hover:text-[#A0522D] transition-colors">
          <ShoppingCart className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#A0522D] rounded-full">{cartItemCount}</span>
          )}
        </Link>
        {user ? (
          <div className="flex items-center gap-4 ml-4">
            <Link to="/dashboard" className="px-4 py-2 bg-[#F2EDE4] text-[#2D3621] rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#E8E2D6] transition-colors">
              Dashboard
            </Link>
            <button onClick={handleSignOut} className="text-[#8B8B8B] hover:text-[#A0522D] flex items-center gap-1 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-[#556B2F] text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#2D3621] transition-colors">Log in</Link>
        )}
      </div>
      <div className="flex items-center md:hidden gap-4">
        <Link to="/cart" className="relative p-2 text-[#556B2F] hover:text-[#A0522D]">
          <ShoppingCart className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#A0522D] rounded-full">{cartItemCount}</span>
          )}
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-[#556B2F] hover:text-[#2D3621]"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full md:hidden bg-[#FDFBF7] border-b border-[#E8E2D6] shadow-lg">
          <div className="pt-2 pb-3 space-y-1 px-4 font-medium uppercase tracking-widest text-[#556B2F] text-xs">
            <Link to="/" className="block px-3 py-3 hover:text-[#A0522D] hover:bg-[#F2EDE4] rounded-lg">Home</Link>
            <Link to="/shop" className="block px-3 py-3 hover:text-[#A0522D] hover:bg-[#F2EDE4] rounded-lg">The Collection</Link>
            <Link to="/distributor" className="block px-3 py-3 hover:text-[#A0522D] hover:bg-[#F2EDE4] rounded-lg">Distributor Hub</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block px-3 py-3 hover:text-[#A0522D] hover:bg-[#F2EDE4] rounded-lg">Dashboard</Link>
                <button onClick={handleSignOut} className="block w-full text-left px-3 py-3 hover:text-[#A0522D] hover:bg-[#F2EDE4] rounded-lg">Sign Out</button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-3 hover:text-[#A0522D] hover:bg-[#F2EDE4] rounded-lg">Log in</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
