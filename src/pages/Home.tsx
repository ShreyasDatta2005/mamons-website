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

  const heroSlides = [
    {
      id: "almonds",
      title: "Premium Roasted Almonds",
      subtitle: "Experience the crunch of ethically handpicked, perfectly roasted almonds.",
      image: "/images/dashboard-almonds.jpg",
      hash: "#almonds"
    },
    {
      id: "cashews",
      title: "Premium Roasted Cashews",
      subtitle: "Finest quality cashews, gently roasted for the perfect healthy snack.",
      image: "/images/dashboard-cashews.jpg",
      hash: "#cashews"
    },
    {
      id: "jaggery",
      title: "Pure Jaggery Powder",
      subtitle: "Unrefined sweetness. Natural sugarcane jaggery packed with minerals.",
      image: "/images/dashboard-jaggery.jpg",
      hash: "#jaggery"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

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
      <section className="relative w-full h-[80vh] flex items-center overflow-hidden bg-[#FDFBF7] text-[#3D3D3D]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`bg-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full"
          >
            <img src={heroSlides[currentSlide].image} alt={heroSlides[currentSlide].title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#eaddd1]/95 via-[#eaddd1]/80 to-transparent"></div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-16 flex items-center h-full">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl flex flex-col justify-center h-full w-full"
            >
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-bold leading-[1.05] mt-2 mb-6 text-[#2D3621]">
                {heroSlides[currentSlide].title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
              <p className="text-sm md:text-lg text-[#2D3621] leading-relaxed max-w-md pb-6 font-medium">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/shop${heroSlides[currentSlide].hash}`} className="bg-[#556B2F] hover:bg-[#2D3621] text-white font-bold px-10 py-4 rounded-full text-xs uppercase tracking-wider inline-flex items-center justify-center transition-colors shadow-lg shadow-[#556B2F]/20 w-max">
                  The Collection
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute right-8 bottom-8 lg:right-12 lg:bottom-12 flex gap-4 hidden md:flex z-20">
            <button onClick={prevSlide} className="w-14 h-14 rounded-full bg-white/60 hover:bg-white text-[#556B2F] flex items-center justify-center shadow-sm transition-all backdrop-blur-sm text-xl">←</button>
            <button onClick={nextSlide} className="w-14 h-14 rounded-full bg-[#556B2F] hover:bg-[#2D3621] flex items-center justify-center text-white shadow-lg transition-all text-xl">→</button>
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
