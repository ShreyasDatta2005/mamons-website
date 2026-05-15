import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { DUMMY_PRODUCTS, Product } from '../store';
import { ArrowRight, ShieldCheck, Leaf, Truck } from 'lucide-react';
import { useCartStore } from '../store';
import { useState } from 'react';

export default function Home() {
  const addItem = useCartStore(state => state.addItem);
  const featured = DUMMY_PRODUCTS.filter(p => p.featured);
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);

  return (
    <div className="flex flex-col flex-grow relative">
      <AnimatePresence>
        {hoveredProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white/5 backdrop-blur-sm pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="flex flex-row justify-center items-center h-[80vh] w-full"
            >
              <img src={hoveredProduct.imageUrl} alt={hoveredProduct.name} className="h-full w-auto object-contain drop-shadow-2xl shrink-0 z-10" />
              {hoveredProduct.backImageUrl && (
                <img src={hoveredProduct.backImageUrl} alt={`${hoveredProduct.name} Back`} className="h-full w-auto object-contain drop-shadow-2xl shrink-0 -ml-16 md:-ml-24 z-0" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center p-8 lg:p-16 overflow-hidden bg-[#FDFBF7] text-[#3D3D3D]">
        <div className="relative w-full h-full bg-[#E8E2D6] rounded-3xl overflow-hidden flex items-center p-8 lg:p-16">
          <div className="z-10 max-w-xl">
            <span className="text-[#A0522D] font-serif italic text-lg lg:text-xl">Summer Harvest 2026</span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold leading-tight mt-2 mb-4 text-[#2D3621]">
              Pure. Roasted.<br/>Sustainably Sourced.
            </h1>
            <p className="text-sm md:text-base text-[#5C5C5C] leading-relaxed max-w-md pb-6">
              Experience the crunch of ethically handpicked nuts and the warmth of unrefined jaggery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="bg-[#556B2F] hover:bg-[#2D3621] text-white font-bold px-8 py-3 rounded-full text-xs uppercase tracking-widest inline-flex items-center justify-center transition-colors">
                The Collection
              </Link>
              <Link to="/distributor" className="bg-white border border-[#E8E2D6] text-[#A0522D] hover:bg-[#F2EDE4] font-bold px-8 py-3 rounded-full text-xs uppercase tracking-widest inline-flex items-center justify-center transition-colors">
                Distributor Hub
              </Link>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 lg:w-3/5 bg-[url('https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-20"></div>
          
          <div className="absolute right-8 bottom-8 lg:right-12 lg:bottom-12 flex gap-2 hidden md:flex">
            <div className="w-12 h-12 rounded-full border border-[#556B2F] flex items-center justify-center text-[#556B2F]">←</div>
            <div className="w-12 h-12 rounded-full bg-[#556B2F] flex items-center justify-center text-white">→</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-[#E8E2D6] flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F2EDE4] text-[#A0522D] flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-[#2D3621] text-lg mb-2">100% Natural</h3>
            <p className="text-[#8B8B8B] text-sm">No preservatives, just pure natural goodness in every bite.</p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-[#E8E2D6] flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F2EDE4] text-[#A0522D] flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-[#2D3621] text-lg mb-2">Premium Quality</h3>
            <p className="text-[#8B8B8B] text-sm">Hand-sorted and rigorously checked for the best quality.</p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-[#E8E2D6] flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F2EDE4] text-[#A0522D] flex items-center justify-center mb-4">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-[#2D3621] text-lg mb-2">Pan-India Delivery</h3>
            <p className="text-[#8B8B8B] text-sm">Fresh products delivered straight to your doorstep safely.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 mb-8 px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-serif font-bold text-[#2D3621]">Featured Collection</h2>
          <Link to="/shop" className="text-xs uppercase font-bold tracking-widest text-[#556B2F] hover:text-[#A0522D] transition-colors border-b border-[#556B2F] hover:border-[#A0522D] pb-1">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -5 }}
              className="flex flex-col group cursor-pointer"
            >
              <div 
                className="w-full aspect-[4/5] overflow-hidden rounded-3xl shadow-sm mb-4 relative bg-[#F9F7F2]"
                onMouseEnter={() => setHoveredProduct(product)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-contain p-4 drop-shadow-xl transition-all duration-700 ease-in-out group-hover:scale-110" />
              </div>
              <h3 className="font-serif font-bold text-[#2D3621] truncate mb-1">{product.name}</h3>
              <p className="text-xs text-[#8B8B8B] mb-4 truncate">{product.category} • Premium Grade</p>
              <div className="mt-auto flex justify-between items-center">
                <span className="font-bold text-[#2D3621]">${product.price.toFixed(2)}</span>
                <button 
                  onClick={() => addItem(product)}
                  className="px-4 py-1.5 bg-[#556B2F] hover:bg-[#2D3621] text-white text-[10px] rounded-full uppercase font-bold tracking-tighter transition-colors"
                >
                  Add
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
