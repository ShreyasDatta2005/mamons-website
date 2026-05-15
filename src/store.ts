import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  backImageUrl?: string;
  category: string;
  featured: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity }] };
    }),
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === productId ? { ...i, quantity } : i
      ),
    })),
  clearCart: () => set({ items: [] }),
}));

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Jaggery Powder (1kg)",
    description: "Pure, unrefined sweetness. Natural sugarcane jaggery packed with minerals.",
    price: 3.99,
    imageUrl: "/images/jaggery-powder.png",
    backImageUrl: "/images/jaggery-powder-back.png",
    category: "Jaggery",
    featured: true
  },
  {
    id: "prod_2",
    name: "Roasted Almond (30g)",
    description: "Premium California Almonds, perfectly roasted for a nutritious crunch.",
    price: 1.49,
    imageUrl: "/images/roasted-almond.png",
    backImageUrl: "/images/roasted-almond-back.png",
    category: "Nuts",
    featured: true
  },
  {
    id: "prod_3",
    name: "Roasted Cashew (20g)",
    description: "Finest quality cashews, gently roasted. The perfect healthy snack.",
    price: 1.29,
    imageUrl: "/images/roasted-cashew.png",
    backImageUrl: "/images/roasted-cashew-back.png",
    category: "Nuts",
    featured: true
  }
];
