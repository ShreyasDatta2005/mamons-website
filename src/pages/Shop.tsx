import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_PRODUCTS, Product } from '../store';
import { useCartStore } from '../store';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function Shop() {
  const addItem = useCartStore((state) => state.addItem);
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full flex-grow relative">
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

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4">
        <div>
          <span className="text-[#A0522D] font-serif italic text-lg">Finest Selection</span>
          <h1 className="text-4xl font-bold font-serif text-[#2D3621] mt-1 mb-2">Our Products</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DUMMY_PRODUCTS.map((product) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={product.id}
            className="flex flex-col hover:-translate-y-2 transition-transform duration-300"
          >
            <div 
              className="w-full aspect-[4/5] mb-6 relative overflow-hidden rounded-3xl shadow-sm bg-[#F9F7F2] group"
              onMouseEnter={() => setHoveredProduct(product)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="absolute inset-0 w-full h-full object-contain p-4 drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#556B2F] uppercase tracking-widest shadow-sm">
                {product.category}
              </div>
            </div>
            
            <h3 className="text-lg font-serif font-bold text-[#2D3621] mb-2">{product.name}</h3>
            <p className="text-xs text-[#8B8B8B] mb-6 flex-grow leading-relaxed">{product.description}</p>
            
            <div className="mt-auto flex justify-between items-center pt-4 border-t border-[#F2EDE4]">
              <span className="font-bold text-[#2D3621]">${product.price.toFixed(2)}</span>
              <button 
                onClick={() => addItem(product)}
                className="px-4 py-2 bg-[#556B2F] hover:bg-[#2D3621] text-white text-[10px] rounded-full uppercase font-bold tracking-tighter transition-colors"
              >
                Add
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
