// Brand color palette helper for Horison Hotels graphic design deliverables

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'primary' | 'accent' | 'secondary' | 'surface' | 'contrast';
}

export function getWorkColorPalette(hotelId: string, categoryId: string): ColorSwatch[] {
  const isSemarang = hotelId === 'hotel_semarang';

  if (categoryId === 'cat_promo' || categoryId === 'cat_marketing') {
    return isSemarang
      ? [
          { name: 'Horison Navy', hex: '#0A192F', role: 'primary' },
          { name: 'Imperial Gold', hex: '#D97706', role: 'accent' },
          { name: 'Warm Amber', hex: '#F59E0B', role: 'secondary' },
          { name: 'Ivory Cream', hex: '#FEF3C7', role: 'surface' },
          { name: 'Obsidian Text', hex: '#0F172A', role: 'contrast' },
        ]
      : [
          { name: 'Resort Ocean Navy', hex: '#0C4A6E', role: 'primary' },
          { name: 'Sunset Bronze', hex: '#EA580C', role: 'accent' },
          { name: 'Golden Sand', hex: '#FBBF24', role: 'secondary' },
          { name: 'Seafoam Tint', hex: '#F0FDFA', role: 'surface' },
          { name: 'Deep Abyssal', hex: '#082F49', role: 'contrast' },
        ];
  }

  if (categoryId === 'cat_hari_nasional') {
    return [
      { name: 'Pancasila Crimson', hex: '#991B1B', role: 'primary' },
      { name: 'Heritage Gold', hex: '#CA8A04', role: 'accent' },
      { name: 'Batik Ochre', hex: '#B45309', role: 'secondary' },
      { name: 'Bone White', hex: '#FAFAF9', role: 'surface' },
      { name: 'Charcoal Noir', hex: '#1C1917', role: 'contrast' },
    ];
  }

  if (categoryId === 'cat_event' || categoryId === 'cat_backdrop') {
    return isSemarang
      ? [
          { name: 'Corporate Midnight', hex: '#1E1B4B', role: 'primary' },
          { name: 'Electric Violet', hex: '#6366F1', role: 'accent' },
          { name: 'Cyan Glow', hex: '#06B6D4', role: 'secondary' },
          { name: 'Frost Pearl', hex: '#F8FAFC', role: 'surface' },
          { name: 'Dark Slate', hex: '#0F172A', role: 'contrast' },
        ]
      : [
          { name: 'Tropical Azure', hex: '#0369A1', role: 'primary' },
          { name: 'Coral Horizon', hex: '#F43F5E', role: 'accent' },
          { name: 'Palm Jade', hex: '#059669', role: 'secondary' },
          { name: 'Sand White', hex: '#FFFBEB', role: 'surface' },
          { name: 'Resort Charcoal', hex: '#1E293B', role: 'contrast' },
        ];
  }

  // Default hospitality brand guidelines
  return isSemarang
    ? [
        { name: 'Horison Deep Navy', hex: '#0B1B3D', role: 'primary' },
        { name: 'Horison Gold', hex: '#D4AF37', role: 'accent' },
        { name: 'Antawirya Blue', hex: '#2563EB', role: 'secondary' },
        { name: 'Clean Surface', hex: '#F8FAFC', role: 'surface' },
        { name: 'Deep Base', hex: '#030712', role: 'contrast' },
      ]
    : [
        { name: 'Jepara Teal', hex: '#0F766E', role: 'primary' },
        { name: 'Coastal Gold', hex: '#EAB308', role: 'accent' },
        { name: 'Marine Cyan', hex: '#0EA5E9', role: 'secondary' },
        { name: 'Breeze Mist', hex: '#F0FDFA', role: 'surface' },
        { name: 'Deep Teak Wood', hex: '#1C1917', role: 'contrast' },
      ];
}
