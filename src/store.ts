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
  reviews?: number;
  rating?: number;
  features?: string[];
  macros?: { label: string; value: string }[];
  healthBenefits?: string[];
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
    name: "Jaggery Powder (1kg) | Pure Organic Unrefined Jaggery",
    description: "Pure, unrefined sweetness. Natural sugarcane jaggery packed with minerals.",
    price: 3.99,
    imageUrl: "/images/jaggery-powder.png",
    backImageUrl: "/images/jaggery-powder-back.png",
    category: "Jaggery",
    featured: true,
    rating: 5,
    reviews: 42,
    features: [
      "Rich, deep caramel flavor with a natural, unrefined sweetness.",
      "Made from absolutely pure organic sugarcane without additives.",
      "Packed with essential minerals like iron, potassium, and magnesium.",
      "Excellent sugar alternative that boosts immunity and aids digestion.",
      "Buy Premium Jaggery Powder at the best price!"
    ],
    macros: [
      { label: "Calories", value: "383 kcal" },
      { label: "Carbs", value: "98g" },
      { label: "Iron", value: "11mg" }
    ],
    healthBenefits: [
      "Immunity Booster",
      "Detoxifies Liver",
      "Blood Purifier"
    ]
  },
  {
    id: "prod_2",
    name: "Roasted Almond (30g) | Premium Roasted & Salted California Almonds",
    description: "Premium California Almonds, perfectly roasted for a nutritious crunch.",
    price: 1.49,
    imageUrl: "/images/roasted-almond.png",
    backImageUrl: "/images/roasted-almond-back.png",
    category: "Nuts",
    featured: true,
    rating: 4.8,
    reviews: 128,
    features: [
      "Exceptional crunchy texture with a perfectly balanced roasted and salted flavor.",
      "Handpicked, premium California Almonds ensuring only the finest quality.",
      "Rich in Vitamin E, healthy fats, and antioxidants for brain health.",
      "A healthy, satisfying snack that keeps your energy levels up throughout the day.",
      "Enjoy premium quality Almonds at a great price!"
    ],
    macros: [
      { label: "Protein", value: "6g" },
      { label: "Fats", value: "14g" },
      { label: "Fiber", value: "3g" }
    ],
    healthBenefits: [
      "Brain Health",
      "Reduces Cholesterol",
      "Rich in Antioxidants"
    ]
  },
  {
    id: "prod_3",
    name: "Roasted Cashew (20g) | Premium Roasted & Salted Cashews",
    description: "Finest quality cashews, gently roasted. The perfect healthy snack.",
    price: 1.29,
    imageUrl: "/images/roasted-cashew.png",
    backImageUrl: "/images/roasted-cashew-back.png",
    category: "Nuts",
    featured: true,
    rating: 4.9,
    reviews: 86,
    features: [
      "Buttery, smooth taste complemented by a delicate roasting process.",
      "Sourced from the finest farms for large, whole, premium quality nuts.",
      "Loaded with heart-healthy monounsaturated fats and essential minerals.",
      "Promotes bone health and provides a substantial protein boost.",
      "The perfect gourmet snack for premium quality at an affordable price!"
    ],
    macros: [
      { label: "Protein", value: "5g" },
      { label: "Healthy Fats", value: "12g" },
      { label: "Magnesium", value: "83mg" }
    ],
    healthBenefits: [
      "Heart Healthy",
      "Energy Boost",
      "Bone Health"
    ]
  }
];
