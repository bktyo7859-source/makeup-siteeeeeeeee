export interface EditorialProductChapter {
  id: string;
  chapterNumber: string; // e.g. "CHAPTER 01"
  category: string;      // e.g. "LE ROUGE • LIPSTICK"
  title: string;         // e.g. "Le Rouge Couture Stunna"
  headline: string;      // e.g. "Color that becomes character."
  description: string;   // e.g. "Hyper-saturated, feather-light liquid lip pigment with 12-hour precision soft-matte finish."
  details: string[];     // e.g. ["12H Soft-Matte Wear", "Infused with Jojoba & Vitamin E", "Precision Hourglass Wand"]
  videoSrc: string;      // path to video
  image1: string;        // path to primary product image
  image1Caption: string; // e.g. "Pure Liquid Pigment"
  image2: string;        // path to detail / swatch image
  image2Caption: string; // e.g. "Fluted Talisman & Swatch"
  pricePlaceholder: string; // "₹ —"
  accentColor: string;   // red / crimson / noir / white theme indicator
  theme: 'noir-red' | 'alabaster-red' | 'crimson-noir' | 'ivory-noir' | 'midnight-red';
  layoutVariant: 'video-left' | 'video-right' | 'split-editorial' | 'magazine-stack' | 'asymmetric-panes';
}
