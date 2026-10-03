import { useState, useCallback } from 'react';
import { Product, Shade, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { EditorialChapters } from './components/EditorialChapters';
import { CollectionSection } from './components/CollectionSection';
import { FormulationRitual } from './components/FormulationRitual';
import { EditorialLookbook } from './components/EditorialLookbook';
import { PressAccolades } from './components/PressAccolades';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { InteractiveShadeFinder } from './components/InteractiveShadeFinder';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

export function App() {
  // E-commerce state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Starter luxury item for rich initial drawer feel
    {
      product: PRODUCTS[0],
      selectedShade: PRODUCTS[0].shades?.[1],
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isShadeFinderOpen, setIsShadeFinderOpen] = useState<boolean>(false);

  // Cart operations
  const handleAddToCart = useCallback((product: Product, shade?: Shade, quantity: number = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedShade?.id === shade?.id
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedShade: shade, quantity }];
      }
    });
  }, []);

  const handleUpdateQuantity = useCallback((index: number, newQty: number) => {
    setCartItems(prev => {
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Navigation handlers
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreHero = () => {
    handleNavigateSection('editorial-chapter-01-lipstick');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="maison-app">
      {/* 1. Haute Navbar — Exactly Preserved */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenShadeFinder={() => setIsShadeFinderOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* 2. Fullscreen Interactive Video Hero — 100% Preserved & Untouched */}
      <main>
        <Hero
          onExploreClick={handleExploreHero}
          onShadeFinderClick={() => setIsShadeFinderOpen(true)}
        />

        {/* 3. The 5 Cinematic Editorial Chapters (BLACK x RED x WHITE Luxury Beauty Spread) */}
        <EditorialChapters />

        {/* 4. The Signature Formulations Catalog */}
        <CollectionSection
          products={PRODUCTS}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
        />

        {/* 5. The 4-Step Formulation Ritual */}
        <FormulationRitual />

        {/* 6. Haute Couture Lookbook */}
        <EditorialLookbook />

        {/* 7. Editorial Press & Accolades */}
        <PressAccolades />
      </main>

      {/* 8. Maison Luxury Footer */}
      <Footer />

      {/* 9. Interactive Modals & Slide-over Drawers */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <InteractiveShadeFinder
        isOpen={isShadeFinderOpen}
        onClose={() => setIsShadeFinderOpen(false)}
        products={PRODUCTS}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
export default App;
