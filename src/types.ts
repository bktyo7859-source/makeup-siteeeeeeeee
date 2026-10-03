export interface Shade {
  id: string;
  name: string;
  hex: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  frenchSubtitle: string;
  category: 'complexion' | 'serum' | 'cream' | 'lips' | 'powder' | 'oil';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  tagline: string;
  description: string;
  benefits: string[];
  keyIngredients: string[];
  ritualStep: string;
  shades?: Shade[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedShade?: Shade;
  quantity: number;
}

export type HeroPhase = 'intro' | 'interactive' | 'paused';
