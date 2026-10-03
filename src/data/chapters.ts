import { EditorialProductChapter } from '../types/editorial';

export const EDITORIAL_CHAPTERS: EditorialProductChapter[] = [
  {
    id: 'chapter-01-lipstick',
    chapterNumber: 'CHAPTER 01',
    category: 'LE ROUGE // COUTURE LIPSTICK',
    title: 'Le Rouge Couture Stunna',
    headline: 'Color that becomes character.',
    description: 'An uncompromising, hyper-saturated French crimson lip fluid. Glides across lips with zero weight, setting into a soft-focus velvet veil that defies smudging, feathering, and transfer for 12 hours.',
    details: [
      'Hyper-Saturated Crimson Liquid Pigment',
      '12-Hour Transfer-Resistant Velvet Wear',
      'Ergonomic Precision Calligraphy Applicator',
      'Enriched with Botanical Jojoba & Vitamin E'
    ],
    videoSrc: '/media/videoplayback (1).mp4',
    image1: '/media/lipstick_1.jpg',
    image1Caption: 'Pure Liquid Lip Pigment & Fluted Talisman',
    image2: '/media/lipstick_2.jpg',
    image2Caption: 'Rich Crimson Arm Swatch & Atelier Box',
    pricePlaceholder: '₹ —',
    accentColor: '#C41E3A',
    theme: 'noir-red',
    layoutVariant: 'video-left'
  },
  {
    id: 'chapter-02-blush',
    chapterNumber: 'CHAPTER 02',
    category: 'ÉCLAT // LIQUID PETAL BLUSH',
    title: 'Dew It Up Liquid Petal Blush',
    headline: 'A flush of pure light-infused petal radiance.',
    description: 'A breathable, weightless cheek emulsion infused with crushed peony hydrosol. Melts into cheekbones effortlessly, catching ambient light for a second-skin watercolor bloom that never cakes or fades.',
    details: [
      'Infused with Peony Hydrosol & Squalane',
      'Seamless Micro-Blend Watercolor Finish',
      'Buildable Sheer Glow to High Drama',
      'Long-Wear Non-Sticky Dewy Bounce'
    ],
    videoSrc: '/media/videoplayback (2).mp4',
    image1: '/media/blush_1.jpg',
    image1Caption: 'Petal Flush Liquid Emulsion & Swatch',
    image2: '/media/blush_2.jpg',
    image2Caption: 'Soft-Focus Doe-Foot Applicator Wand',
    pricePlaceholder: '₹ —',
    accentColor: '#D92546',
    theme: 'alabaster-red',
    layoutVariant: 'video-right'
  },
  {
    id: 'chapter-03-nail-paint',
    chapterNumber: 'CHAPTER 03',
    category: 'VERNIS // METALLIC NAIL LACQUER',
    title: 'Metallicious Haute Lacquer',
    headline: 'Architectural shine. Untamed refraction.',
    description: 'A high-impact metallic nail lacquer infused with mirror-grade chrome micro-pearls. Delivers ultra-reflective multi-dimensional shine and 10-day chip-resistant gel armor with a single coat.',
    details: [
      'Mirror-Finish Chrome Micro-Refraction',
      '10-Day Chip-Defying High-Gloss Armor',
      'Precision Contoured Wide Fan Brush',
      '100% Vegan & Non-Toxic 12-Free Formula'
    ],
    videoSrc: '/media/videoplayback (3).mp4',
    image1: '/media/nail_paint_1.jpg',
    image1Caption: 'Shadow Grey Metallic Chrome Lacquer',
    image2: '/media/images (6).jpg',
    image2Caption: 'Stiletto Diamond Sparkle Reflection',
    pricePlaceholder: '₹ —',
    accentColor: '#C41E3A',
    theme: 'crimson-noir',
    layoutVariant: 'split-editorial'
  },
  {
    id: 'chapter-04-skincare-set',
    chapterNumber: 'CHAPTER 04',
    category: 'SOIN // BIO-HYDRATING REGIMEN',
    title: 'Rituel Bio-Hydratant Intégral',
    headline: 'The architecture of cellular hydration.',
    description: 'A complete 5-piece restorative treatment system engineered to reset, rebalance, and infuse skin with deep cellular moisture. Minimizes pore appearance and creates an unshakeable glass-skin barrier.',
    details: [
      'Complete 5-Step Dermal Synergy Regimen',
      'Deep Purifying Cleanser & Balance Toner',
      'Concentrated Triple-Hyaluronic Serum',
      'Restorative Barrier Cream & Night Infusion'
    ],
    videoSrc: '/media/videoplayback (4).mp4',
    image1: '/media/skincare_set_1.jpg',
    image1Caption: 'The 5-Piece Cellular Regimen Lineup',
    image2: '/media/skincare_set_2.jpg',
    image2Caption: 'Atelier Complete Treatment Presentation Box',
    pricePlaceholder: '₹ —',
    accentColor: '#9E1C28',
    theme: 'ivory-noir',
    layoutVariant: 'asymmetric-panes'
  },
  {
    id: 'chapter-05-eyeliner',
    chapterNumber: 'CHAPTER 05',
    category: 'LE STYLO // WATERPROOF CALLIGRAPHY',
    title: 'Forever Stay Waterproof Eyeliner Stylo',
    headline: 'Graphic precision. Carbon midnight intensity.',
    description: 'Engineered with a 0.01mm Japanese flexi-calligraphy felt tip and deep carbon-black polymer emulsion. Delivers ultra-crisp winged lines that resist water, sweat, and friction for 24 uninterrupted hours.',
    details: [
      '0.01mm Ultra-Fine Flexi Calligraphy Tip',
      '24-Hour Waterproof & Smudge-Proof Hold',
      'Deepest Carbon Black Pigment Density',
      'Instant Clean-Dry Fluid Polymer Formula'
    ],
    videoSrc: '/media/videoplayback.mp4',
    image1: '/media/eyeliner_1.jpg',
    image1Caption: 'Forever Stay Calligraphy Pen & Winged Stroke',
    image2: '/media/eyeliner_2.png',
    image2Caption: 'The ONE Precision Felt Tip Architecture',
    pricePlaceholder: '₹ —',
    accentColor: '#E61C38',
    theme: 'midnight-red',
    layoutVariant: 'magazine-stack'
  }
];
