import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'fond-de-teint-soie-pure',
    name: "Fond de Teint Soie Pure",
    frenchSubtitle: "Éclat Soyeux • Skin Perfection Foundation",
    category: 'complexion',
    price: 140,
    rating: 4.9,
    reviewsCount: 342,
    image: '/images/foundation.jpg',
    badge: 'Iconic Bestseller',
    tagline: 'Weightless micro-silk coverage infused with optical light-diffusing crystals.',
    description: 'A ground-breaking liquid silk foundation that moves with your expressions. Formulated with French alpine edelweiss and 24K gold micro-peptides for 24-hour hydration and a second-skin finish that naturally blurs imperfections.',
    benefits: [
      'Luminous medium-to-full buildable coverage',
      'Infused with 85% skincare base & bio-fermented squalane',
      'Resistant to humidity and transfer with 16h breathable wear',
      'Broad spectrum SPF 25 mineral protection'
    ],
    keyIngredients: ['French Alpine Edelweiss', 'Bio-Fermented Squalane', '24K Gold Peptides', 'Hyaluronic Acid Spheres'],
    ritualStep: 'Step 3: Sculpt & Illuminate',
    shades: [
      { id: '10n', name: '10N Porcelaine Pure', hex: '#F9E4D4', description: 'Fair with neutral undertones' },
      { id: '20w', name: '20W Albâtre Doré', hex: '#F2D5BD', description: 'Light with warm golden undertones' },
      { id: '30c', name: '30C Nectar Rosé', hex: '#EAC2A6', description: 'Light-medium with soft rose undertones' },
      { id: '40n', name: '40N Beige Lumière', hex: '#DEB08F', description: 'Medium with balanced neutral undertones' },
      { id: '50w', name: '50W Ambre Chaud', hex: '#C6946E', description: 'Tan with radiant warm undertones' },
      { id: '60n', name: '60N Ébène Royal', hex: '#875338', description: 'Deep rich with neutral warm undertones' }
    ],
    inStock: true
  },
  {
    id: 'elixir-sublime-lumiere',
    name: "L'Élixir Sublime Lumière",
    frenchSubtitle: "Sérum Visage Régénérant • Cellular Radiance Elixir",
    category: 'serum',
    price: 185,
    originalPrice: 210,
    rating: 5.0,
    reviewsCount: 528,
    image: '/images/serum.jpg',
    badge: 'Award Winner 2026',
    tagline: 'The supreme botanical nectar for instantaneous cellular luminosity and firming.',
    description: 'A miraculous blend of rare botanical active extracts and cold-pressed French camellia seed oil. Each drop delivers bio-identical lipid replenishing ceramides, visibly smoothing fine lines and restoring high-fashion dewy glow within 3 minutes.',
    benefits: [
      'Instantaneous optical radiance and light bounce',
      'Increases cellular dermal density by 42% in 28 days',
      'Non-greasy, fast-penetrating dry nectar formula',
      'Powerful antioxidant barrier against urban pollution'
    ],
    keyIngredients: ['Rare White Camellia Seed', 'Botanical Bakuchiol', 'Ferulic Tri-Peptide', 'CoQ10 Golden Nectar'],
    ritualStep: 'Step 1: Awaken & Infuse',
    inStock: true
  },
  {
    id: 'creme-sculptante-24k',
    name: "Crème Regenerative Aura",
    frenchSubtitle: "Soin Visage Régénérant • Bio-Peptide Velvet Infusion",
    category: 'cream',
    price: 240,
    rating: 4.9,
    reviewsCount: 219,
    image: '/images/cream.jpg',
    badge: 'Haute Formulation',
    tagline: 'Rich restorative balm that transforms into a breathable protective cocoon.',
    description: 'Harvested at peak potency, this luxurious emulsion combines rare arctic snow algae and biomimetic lipid matrix. It melts into the skin upon contact, providing intense 72-hour moisture locking and sculpted facial contours.',
    benefits: [
      'Sculpts facial contours and restores elasticity',
      'Deep barrier restoration for fragile and dehydrated skin',
      'Infuses skin with velvety, non-sticky satin cashmere veil',
      'Includes custom weighted zamak cooling sculpting wand'
    ],
    keyIngredients: ['Snow Algae Bio-Complex', 'Triple Lipid Biomimetic Ceramides', 'Rose Centifolia Hydrosol', 'Niacinamide 5%'],
    ritualStep: 'Step 2: Nourish & Sculpt',
    inStock: true
  },
  {
    id: 'baume-levres-haute-couture',
    name: "Aurore Lip Velvet Couture",
    frenchSubtitle: "Rouge à Lèvres Satiné • Nectar Glaze Velvet Lip",
    category: 'lips',
    price: 68,
    rating: 4.8,
    reviewsCount: 184,
    image: '/images/lipstick.jpg',
    badge: 'New Edition',
    tagline: 'Couture pigmented velvet lipstick infused with nourishing floral botanical oils.',
    description: 'Housed in an architectural fluted gold talisman case, Aurore Lip Velvet delivers saturated French pigment with an ultra-comfortable cloud-velvet texture. Blurs lip lines while plumping with hyaluronic micro-reservoirs.',
    benefits: [
      'Intense, weightless color payoff in a single glide',
      'Cloud-soft satin matte finish that never flakes or parches',
      'Magnetic click closure with engraved maison crest',
      'Refillable sustainable casing'
    ],
    keyIngredients: ['French Rose Flower Wax', 'Wild Mango Butter', 'Hyaluronic Micro-Spheres', 'Vitamin E Acetate'],
    ritualStep: 'Step 4: Couture Accent',
    shades: [
      { id: 'lip-01', name: '01 Rose Madeleine', hex: '#B85D66', description: 'Refined Parisian dusty rose velvet' },
      { id: 'lip-02', name: '02 Rouge Vendôme', hex: '#9E1C28', description: 'Iconic deep French crimson matte' },
      { id: 'lip-03', name: '03 Nude Palais', hex: '#B57C68', description: 'Warm toasted caramel nude' },
      { id: 'lip-04', name: '04 Baie Impériale', hex: '#782C40', description: 'Sultry crushed berry satin' }
    ],
    inStock: true
  }
];
