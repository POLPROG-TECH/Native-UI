/** Device viewports for the toolbar viewport menu, grouped by form factor. */
export const VIEWPORTS = {
  /** ── Small / legacy ── */
  iphoneSE: { name: 'iPhone SE', styles: { width: '375px', height: '667px' } },
  /** ── Modern iPhones ── */
  iphone13: { name: 'iPhone 13', styles: { width: '390px', height: '844px' } },
  iphone15Pro: {
    name: 'iPhone 15 Pro',
    styles: { width: '393px', height: '852px' },
  },
  iphone16ProMax: {
    name: 'iPhone 16 Pro Max',
    styles: { width: '440px', height: '956px' },
  },
  /** ── Modern Android ── */
  pixel6: { name: 'Pixel 6', styles: { width: '412px', height: '915px' } },
  pixel8Pro: { name: 'Pixel 8 Pro', styles: { width: '448px', height: '998px' } },
  galaxyS24: {
    name: 'Galaxy S24',
    styles: { width: '384px', height: '832px' },
  },
  /** ── Tablets ── */
  ipadMini: { name: 'iPad mini', styles: { width: '768px', height: '1024px' } },
  ipad13: { name: 'iPad Pro 13"', styles: { width: '1032px', height: '1376px' } },
  pixelTablet: {
    name: 'Pixel Tablet',
    styles: { width: '840px', height: '1200px' },
  },
};
