import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_PRODUCTS, Product } from '../store';
import { useCartStore } from '../store';
import { ShoppingCart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CategorySection = ({ 
  section, 
  handleMouseEnter,
  handleMouseLeave,
  addItem 
}: { 
  section: { id: string; title: string; image: string; products: Product[] }; 
  handleMouseEnter: (p: Product) => void;
  handleMouseLeave: () => void;
  addItem: (p: Product) => void;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [itemsToRight, setItemsToRight] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(20);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
          setItemsToRight(0);
        } else {
          const itemWidth = window.innerWidth >= 640 ? 320 + 24 : 260 + 24; 
          const maxScroll = scrollWidth - clientWidth;
          const remainingScroll = maxScroll - scrollLeft;
          const items = Math.ceil(remainingScroll / itemWidth);
          setItemsToRight(items);
        }

        const maxScroll = scrollWidth - clientWidth;
        setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
        
        if (scrollWidth > 0 && clientWidth > 0) {
          const ratio = clientWidth / scrollWidth;
          setThumbWidth(Math.max(15, Math.min(100, ratio * 100)));
        }
      }
    };
    
    // Initial calc after a small delay to ensure rendering is complete
    setTimeout(updateScroll, 100);
    
    window.addEventListener('resize', updateScroll);
    const scrollEl = scrollContainerRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', updateScroll);
    }
    
    return () => {
      window.removeEventListener('resize', updateScroll);
      if (scrollEl) {
        scrollEl.removeEventListener('scroll', updateScroll);
      }
    }
  }, [section]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startProgress = scrollProgress;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!trackRef.current || !scrollContainerRef.current) return;
      
      const trackWidth = trackRef.current.clientWidth;
      const thumbPixelWidth = (thumbWidth / 100) * trackWidth;
      const draggableWidth = trackWidth - thumbPixelWidth;
      
      if (draggableWidth <= 0) return;
      
      const deltaX = moveEvent.clientX - startX;
      const deltaProgress = deltaX / draggableWidth;
      
      let nextProgress = startProgress + deltaProgress;
      nextProgress = Math.max(0, Math.min(1, nextProgress));
      
      const scrollEl = scrollContainerRef.current;
      const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
      scrollEl.scrollLeft = nextProgress * maxScroll;
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <section id={section.id} className="mb-16 pt-8 scroll-mt-24 relative">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#2D3621] flex items-center">
          <img src="/images/logo.png" alt="Mamon's" className="h-9 md:h-11 inline-block mr-3 object-contain mt-1" />
          {section.title}
        </h2>
        {itemsToRight > 0 && (
          <span className="text-sm font-medium text-[#A0522D] bg-[#F9F7F2] px-4 py-1.5 rounded-full border border-[#E8E2D6]">
            {itemsToRight} more {itemsToRight === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>
      <div 
        ref={scrollContainerRef}
        className={`flex overflow-x-auto gap-6 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? '' : 'snap-x snap-mandatory'}`}
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        {section.products.map((product) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            key={product.id}
            className="flex flex-col hover:-translate-y-2 transition-transform duration-300 w-[260px] sm:w-[320px] shrink-0 snap-start"
          >
            <div 
              className="w-full aspect-[4/5] mb-6 relative overflow-hidden rounded-3xl shadow-sm bg-[#F9F7F2] group cursor-pointer"
              onMouseEnter={() => handleMouseEnter(product)}
              onMouseLeave={handleMouseLeave}
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
        
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`placeholder-${i}`} className="flex flex-col w-[260px] sm:w-[320px] shrink-0 snap-start">
            <div className="w-full aspect-[4/5] flex flex-col justify-center items-center rounded-3xl border-2 border-dashed border-[#E8E2D6] bg-[#FDFBF7]/50 p-8 text-center">
              <span className="text-[#8B8B8B] font-serif text-lg leading-relaxed">More Products coming soon.<br/><br/>Thank you for your patience</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Custom tiny right-aligned scrollbar */}
      {thumbWidth < 100 && (
        <div className="absolute bottom-0 right-0 w-32 sm:w-48 xl:w-64 p-2 -pb-2 cursor-pointer z-10">
          <div ref={trackRef} className="w-full h-1 bg-[#E8E2D6] rounded-full relative">
            <div 
              onPointerDown={handlePointerDown}
              className={`absolute top-1/2 -translate-y-1/2 h-2 ${isDragging ? 'bg-[#A0522D]' : 'bg-[#A0522D]/60'} hover:bg-[#A0522D] rounded-full transition-colors cursor-grab active:cursor-grabbing backdrop-blur-sm shadow-sm`}
              style={{
                left: `${scrollProgress * (100 - thumbWidth)}%`,
                width: `${thumbWidth}%`
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default function Shop() {
  const addItem = useCartStore((state) => state.addItem);
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  const handleMouseEnter = (product: Product) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredProduct(product);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredProduct(null);
    }, 150);
  };

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const categories = ["Almonds", "Cashews", "Jaggery", "Nuts"]; // Kept Nuts incase anything else uses it
  
  // Actually let's just create clean distinct sections based on the specific required terms
  const displaySections = [
    { id: 'almonds', title: 'Premium Almonds', image: '/images/category-almonds.png', products: DUMMY_PRODUCTS.filter(p => p.name.includes("Almond")) },
    { id: 'cashews', title: 'Roasted Cashews', image: '/images/category-cashews.png', products: DUMMY_PRODUCTS.filter(p => p.name.includes("Cashew")) },
    { id: 'jaggery', title: 'Jaggery Powder', image: '/images/category-jaggery.png', products: DUMMY_PRODUCTS.filter(p => p.category === "Jaggery") },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-12 w-full flex-grow relative">
      <AnimatePresence>
        {hoveredProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-[#FDFBF7]/80 backdrop-blur-[2px] pointer-events-none"
            onClick={() => setHoveredProduct(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); }}
              onMouseLeave={handleMouseLeave}
              className="flex flex-col md:flex-row justify-center items-center h-[65vh] w-full max-w-7xl lg:gap-12 pointer-events-auto px-4"
            >
              {/* LEFT: Macros & Benefits Stickers */}
              <div className="hidden md:flex flex-1 flex-col justify-center items-end gap-3 min-w-0 pr-4 lg:pr-8">
                {hoveredProduct.macros && (
                  <div className="flex flex-col gap-2.5 w-full max-w-[200px]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#A0522D]/80 mb-1 text-right">Nutrition</h4>
                    {hoveredProduct.macros.map((m, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/70 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-sm border border-[#E8E2D6]/50">
                        <span className="text-gray-500 font-medium text-xs">{m.label}</span>
                        <span className="text-[#2D3621] font-bold text-sm">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {hoveredProduct.healthBenefits && (
                  <div className="flex flex-col gap-2.5 w-full max-w-[200px] mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5D23]/80 mb-1 text-right">Benefits</h4>
                    {hoveredProduct.healthBenefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-[#4A5D23]/5 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#4A5D23]/20 shadow-sm">
                        <svg className="w-3.5 h-3.5 text-[#4A5D23] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[#2D3621] font-bold text-xs">{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CENTER: Images */}
              <div className="flex-1 flex flex-row items-center justify-center h-full max-h-[65vh] relative min-h-[30vh]">
                <img src={hoveredProduct.imageUrl} alt={hoveredProduct.name} className="h-full w-auto object-contain drop-shadow-2xl z-10" />
                {hoveredProduct.backImageUrl && (
                  <img src={hoveredProduct.backImageUrl} alt={`${hoveredProduct.name} Back`} className="h-full w-auto object-contain drop-shadow-2xl -ml-12 md:-ml-16 z-0 opacity-80" />
                )}
              </div>

              {/* RIGHT: Text content */}
              <div className="flex-1 flex flex-col justify-center min-w-0 md:max-w-[340px] h-full pl-4 lg:pl-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1A1A1A] mb-2 font-serif leading-tight">
                  {hoveredProduct.name}
                </h2>
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="flex text-[#FDE047]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < Math.floor(hoveredProduct.rating || 5) ? "currentColor" : "none"} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 drop-shadow-sm">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium text-xs sm:text-sm">{hoveredProduct.reviews || 0} reviews</span>
                </div>

                <div className="flex flex-wrap items-baseline gap-1.5 md:gap-2 mb-4">
                  <span className="text-lg sm:text-xl font-bold text-[#1A1A1A]">Price - ${hoveredProduct.price.toFixed(2)}</span>
                  <span className="text-gray-500 font-medium text-xs">(MRP Incl. all taxes)</span>
                </div>

                <ul className="space-y-2 pt-1 mb-2 text-[#4A4A4A] text-[11px] sm:text-xs md:text-[13px] font-medium leading-relaxed">
                  {hoveredProduct.features?.map((feature, idx) => {
                    const importantWords = feature.match(/(pure|organic|premium|100%|Almonds|Cashews|Walnuts|Pistachios|Honey)/gi);
                    return (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#A0522D] mt-1.5 shrink-0" />
                        <span>
                          {importantWords ? (
                            <span dangerouslySetInnerHTML={{
                              __html: feature.replace(/(pure|organic|premium|100% pure honey|Almonds|Cashews|Walnuts|Pistachios|Honey)/gi, '<strong class="text-[#1A1A1A]">$1</strong>')
                            }} />
                          ) : feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4 max-w-5xl mx-auto pt-0">
        <h2 className="text-xl sm:text-2xl font-serif text-center text-[#2D3621] mb-2">Shop by Category</h2>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
          {displaySections.map(section => (
            <button 
              key={`nav-${section.id}`}
              onClick={() => {
                const element = document.getElementById(section.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 mb-1 rounded-full bg-transparent border border-transparent group-hover:bg-[#F9F7F2] group-hover:border-[#A0522D] group-hover:shadow-sm transition-all duration-300 p-2 flex items-center justify-center">
                <img src={section.image} alt={section.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="font-serif text-[#A0522D] font-bold text-sm sm:text-base group-hover:text-[#2D3621] transition-colors">
                Buy {section.title.replace('Premium ', '').replace('Roasted ', '').replace(' Powder', '')}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E8E2D6]">
        <div>
          <span className="text-[#A0522D] font-serif italic text-lg">Finest Selection</span>
          <h1 className="text-4xl font-bold font-serif text-[#2D3621] mt-1 mb-2">Our Products</h1>
        </div>
      </div>

      {displaySections.map(section => section.products.length > 0 && (
        <CategorySection 
          key={section.id} 
          section={section} 
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          addItem={addItem} 
        />
      ))}
    </div>
  );
}
