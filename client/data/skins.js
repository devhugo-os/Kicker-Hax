const svgSkin = (id, colors, symbol, motif = 'stripes') => {
  const [base, accent, glow] = colors;
  const motifs = {
    stripes: `<path d="M20 178L178 20M58 226L226 58" stroke="${accent}" stroke-width="18" opacity=".3"/>`,
    shield: `<path d="M128 35L205 66V126C205 176 173 211 128 229C83 211 51 176 51 126V66Z" fill="${accent}" opacity=".22" stroke="${accent}" stroke-width="5"/>`,
    flame: `<path d="M130 225C73 213 55 167 80 127C88 155 108 155 104 122C101 89 132 62 158 34C151 75 187 91 190 137C194 181 169 214 130 225Z" fill="${accent}" opacity=".36"/>`,
    bolt: `<path d="M145 20L65 141H117L100 236L194 111H140Z" fill="${accent}" opacity=".4"/>`,
    crown: `<path d="M52 102L82 58L126 100L171 55L207 102L190 157H66Z" fill="${accent}" opacity=".35"/>`,
    galaxy: `<g fill="${accent}"><circle cx="55" cy="76" r="5"/><circle cx="188" cy="61" r="7"/><circle cx="203" cy="176" r="4"/><path d="M42 172Q126 68 216 117Q144 213 42 172Z" fill="none" stroke="${accent}" stroke-width="10" opacity=".4"/></g>`
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><defs><radialGradient id="g"><stop offset="0" stop-color="${glow}"/><stop offset="1" stop-color="${base}"/></radialGradient><filter id="s"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity=".6"/></filter></defs><circle cx="128" cy="128" r="126" fill="url(#g)"/>${motifs[motif] || motifs.stripes}<circle cx="128" cy="128" r="111" fill="none" stroke="${accent}" stroke-width="4" opacity=".75"/><text x="128" y="151" text-anchor="middle" font-size="88" font-family="Arial" font-weight="900" fill="white" filter="url(#s)">${symbol}</text><path d="M66 186H190" stroke="${accent}" stroke-width="6" stroke-linecap="round"/><text x="128" y="214" text-anchor="middle" font-size="15" font-family="Arial" font-weight="800" fill="white">${id.toUpperCase()}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export const SKINS = [
  { id: 'rookie', name: 'Novato', rarity: 'common', image: svgSkin('KX', ['#176b35', '#66df8f', '#0d321c'], 'K', 'shield') },
  { id: 'street', name: 'Craque da Rua', rarity: 'common', image: svgSkin('Rua', ['#254e70', '#7ec8ff', '#102334'], 'R', 'stripes') },
  { id: 'keeper', name: 'Muralha', rarity: 'common', image: svgSkin('Def', ['#772f1a', '#ff9c6b', '#31140c'], 'D', 'shield') },
  { id: 'neon', name: 'Neon Striker', rarity: 'rare', image: svgSkin('Neon', ['#072b4f', '#27d7ff', '#00121f'], 'N', 'bolt') },
  { id: 'royal', name: 'Camisa 10', rarity: 'rare', image: svgSkin('10', ['#35216b', '#c29cff', '#130b28'], '10', 'crown') },
  { id: 'inferno', name: 'Chute Infernal', rarity: 'rare', image: svgSkin('Fire', ['#7b1717', '#ffb13b', '#2d0808'], 'F', 'flame') },
  { id: 'aurum', name: 'Aurum', rarity: 'epic', image: svgSkin('Gold', ['#7a5300', '#ffe17a', '#291b00'], 'A', 'crown') },
  { id: 'storm', name: 'Tempestade', rarity: 'epic', image: svgSkin('Volt', ['#123184', '#8ed7ff', '#060f2c'], 'V', 'bolt') },
  { id: 'void', name: 'Vazio', rarity: 'epic', image: svgSkin('Void', ['#24113d', '#c85cff', '#090411'], 'V', 'galaxy') },
  { id: 'obsidian', name: 'Obsidiana', rarity: 'legendary', image: svgSkin('OBS', ['#05070d', '#4d8dff', '#000000'], 'O', 'shield') },
  { id: 'galaxy', name: 'Galáxia KX', rarity: 'legendary', image: svgSkin('KX', ['#19104b', '#ff72ee', '#050216'], 'G', 'galaxy') },
  { id: 'champion', name: 'Campeão', rarity: 'legendary', image: svgSkin('WIN', ['#725800', '#fff0a3', '#211900'], 'W', 'crown') }
];

export const CHESTS = {
  common: { id: 'common', name: 'Baú Comum', price: 120, accent: '#4ade80', rarities: ['common', 'common', 'common', 'rare'] },
  golden: { id: 'golden', name: 'Baú Dourado', price: 320, accent: '#facc15', rarities: ['rare', 'rare', 'epic', 'epic'] },
  obsidian: { id: 'obsidian', name: 'Baú de Obsidiana', price: 700, accent: '#a78bfa', rarities: ['epic', 'epic', 'legendary', 'legendary'] }
};

export const SKIN_VALUES = { common: 120, rare: 320, epic: 700, legendary: 1200, custom: 1800 };
export const NO_SKIN = { id: 'none', name: 'Sem skin', rarity: 'none', image: '', value: 0 };

export function getSkinValue(skin) {
  if (skin?.id === 'rookie') return 0;
  return SKIN_VALUES[skin?.rarity || (skin?.custom ? 'custom' : 'common')] || 120;
}

export function rollChest(chestId) {
  const chest = CHESTS[chestId];
  const rarity = chest.rarities[Math.floor(Math.random() * chest.rarities.length)];
  const pool = SKINS.filter(skin => skin.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getSkinById(id) {
  return SKINS.find(skin => skin.id === id) || SKINS[0];
}

export function getEquippedSkin(profile) {
  if (profile?.equippedSkinId === NO_SKIN.id) return NO_SKIN;
  if (profile?.equippedSkinImage) return { id: profile.equippedSkinId || 'custom', image: profile.equippedSkinImage, name: 'Skin personalizada' };
  const skin = getSkinById(profile?.equippedSkinId || 'rookie');
  // The profile badge is the visual identity of the default Rookie skin.
  // Purchased/custom skins replace it completely while keeping the team ring.
  return skin.id === 'rookie' ? { ...skin, image: '' } : skin;
}

export function usesProfileBadge(profile) {
  return String(profile?.equippedSkinId || 'rookie') === 'rookie';
}
