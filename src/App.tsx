import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Distributor from './pages/Distributor';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#3D3D3D] font-sans selection:bg-[#E8E2D6]">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/distributor" element={<Distributor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <footer className="border-t border-[#E8E2D6] bg-white text-[#5C5C5C] py-12 px-10 mt-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#2D3621] font-serif">Mamon's</h3>
              <p className="text-sm">Premium quality products sourced ethically, bringing you pure sweetness and crunch.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold font-serif text-[#2D3621] mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-[10px] uppercase tracking-widest font-bold text-[#556B2F]">
                <li><a href="/shop" className="hover:text-[#A0522D] transition-colors">Shop All</a></li>
                <li><a href="/distributor" className="hover:text-[#A0522D] transition-colors">Become a Partner</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#E8E2D6] text-[10px] uppercase tracking-[0.2em] text-[#A2A2A2] flex flex-col md:flex-row justify-between items-center gap-4">
            <span>Premium Quality Guaranteed</span>
            <span className="hidden md:inline">●</span>
            <span>Ethically Sourced Worldwide</span>
            <span className="hidden md:inline">●</span>
            <span>Natural Ingredients Only</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
