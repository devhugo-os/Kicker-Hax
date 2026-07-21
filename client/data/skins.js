const svgSkin = (id, colors, symbol, motif = 'stripes') => {
  const [base, accent, glow] = colors;
  const motifs = {
    stripes: `<path d="M20 178L178 20M58 226L226 58" stroke="${accent}" stroke-width="18" opacity=".3"/>`,
    shield: `<path d="M128 35L205 66V126C205 176 173 211 128 229C83 211 51 176 51 126V66Z" fill="${accent}" opacity=".22" stroke="${accent}" stroke-width="5"/>`,
    flame: `<path d="M130 225C73 213 55 167 80 127C88 155 108 155 104 122C101 89 132 62 158 34C151 75 187 91 190 137C194 181 169 214 130 225Z" fill="${accent}" opacity=".36"/>`,
    bolt: `<path d="M145 20L65 141H117L100 236L194 111H140Z" fill="${accent}" opacity=".4"/>`,
    crown: `<path d="M52 102L82 58L126 100L171 55L207 102L190 157H66Z" fill="${accent}" opacity=".35"/>`,
    galaxy: `<g fill="${accent}"><circle cx="55" cy="76" r="5"/><circle cx="188" cy="61" r="7"/><circle cx="203" cy="176" r="4"/><path d="M42 172Q126 68 216 117Q144 213 42 172Z" fill="none" stroke="${accent}" stroke-width="10" opacity=".4"/></g>`,
    waves: `<g fill="none" stroke="${accent}" stroke-width="12" opacity=".42"><path d="M20 82Q58 48 96 82T172 82T248 82"/><path d="M8 145Q46 111 84 145T160 145T236 145"/><path d="M25 205Q63 171 101 205T177 205T253 205"/></g>`,
    target: `<g fill="none" stroke="${accent}" opacity=".42"><circle cx="128" cy="128" r="76" stroke-width="13"/><circle cx="128" cy="128" r="42" stroke-width="9"/><path d="M128 25V72M128 184V231M25 128H72M184 128H231" stroke-width="9"/></g>`,
    crystal: `<g fill="${accent}" opacity=".3" stroke="${accent}" stroke-width="4"><path d="M128 20L205 88L177 211L128 239L75 208L48 88Z"/><path d="M48 88L128 122L205 88M128 20V239M75 208L128 122L177 211" fill="none" opacity=".9"/></g>`,
    circuit: `<g fill="none" stroke="${accent}" stroke-width="8" opacity=".42"><path d="M25 69H82V105H174V56H231M20 183H71V147H187V193H236"/><circle cx="82" cy="105" r="8" fill="${accent}"/><circle cx="187" cy="193" r="8" fill="${accent}"/></g>`,
    eclipse: `<g opacity=".42"><circle cx="111" cy="112" r="79" fill="${accent}"/><circle cx="145" cy="94" r="77" fill="${base}"/><path d="M34 187Q128 135 222 187" fill="none" stroke="${accent}" stroke-width="11"/></g>`,
    wings: `<g fill="${accent}" opacity=".34"><path d="M116 92Q68 36 21 66Q63 84 78 127Q42 113 27 143Q70 158 115 194Z"/><path d="M140 92Q188 36 235 66Q193 84 178 127Q214 113 229 143Q186 158 141 194Z"/></g>`,
    shards: `<g fill="${accent}" opacity=".34"><path d="M21 59L92 92L49 128Z"/><path d="M235 44L166 97L218 124Z"/><path d="M31 205L96 166L72 230Z"/><path d="M226 208L158 172L187 235Z"/></g>`
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
  { id: 'champion', name: 'Campeão', rarity: 'legendary', image: svgSkin('WIN', ['#725800', '#fff0a3', '#211900'], 'W', 'crown') },
  { id: 'tide', name: 'Maré Alta', rarity: 'common', image: svgSkin('Tide', ['#0d4f67', '#63d5ff', '#062631'], 'M', 'waves') },
  { id: 'bullseye', name: 'Na Gaveta', rarity: 'common', image: svgSkin('Alvo', ['#5b2431', '#ff7892', '#240e14'], 'X', 'target') },
  { id: 'forest', name: 'Raiz do Campo', rarity: 'common', image: svgSkin('Raiz', ['#245235', '#9de374', '#0d2516'], 'R', 'shield') },
  { id: 'frost', name: 'Geada', rarity: 'common', image: svgSkin('Frost', ['#31556b', '#c9f4ff', '#10212c'], 'G', 'crystal') },
  { id: 'carbon', name: 'Carbono', rarity: 'common', image: svgSkin('Carbon', ['#30343b', '#b8c1cc', '#111317'], 'C', 'stripes') },
  { id: 'cyber', name: 'Cyber Kicker', rarity: 'rare', image: svgSkin('Cyber', ['#063f45', '#22f5cc', '#03191c'], 'C', 'circuit') },
  { id: 'sakura', name: 'Sakura FC', rarity: 'rare', image: svgSkin('Sakura', ['#6c244a', '#ff9bd5', '#280c1c'], 'S', 'shards') },
  { id: 'venom', name: 'Veneno', rarity: 'rare', image: svgSkin('Venom', ['#244b0c', '#adff45', '#0c1b04'], 'V', 'flame') },
  { id: 'phantom', name: 'Fantasma', rarity: 'rare', image: svgSkin('Ghost', ['#343866', '#bec8ff', '#101226'], 'F', 'eclipse') },
  { id: 'comet', name: 'Cometa Azul', rarity: 'rare', image: svgSkin('Comet', ['#123a70', '#72d9ff', '#06152d'], 'C', 'bolt') },
  { id: 'phoenix', name: 'Fênix Rubra', rarity: 'epic', image: svgSkin('Phoenix', ['#681118', '#ffca5c', '#280407'], 'F', 'wings') },
  { id: 'leviathan', name: 'Leviatã', rarity: 'epic', image: svgSkin('Levia', ['#073e64', '#44e5ff', '#031625'], 'L', 'waves') },
  { id: 'prism', name: 'Prisma', rarity: 'epic', image: svgSkin('Prism', ['#3e246d', '#ff9df4', '#130824'], 'P', 'crystal') },
  { id: 'samurai', name: 'Samurai 10', rarity: 'epic', image: svgSkin('Ronin', ['#681d2a', '#ffd0a1', '#24080d'], '10', 'shards') },
  { id: 'overdrive', name: 'Overdrive', rarity: 'epic', image: svgSkin('Drive', ['#183580', '#56ffff', '#07122e'], 'O', 'circuit') },
  { id: 'solar', name: 'Eclipse Solar', rarity: 'legendary', image: svgSkin('Solar', ['#4b1700', '#ffd447', '#190700'], 'S', 'eclipse') },
  { id: 'celestial', name: 'Celestial', rarity: 'legendary', image: svgSkin('Sky', ['#15166b', '#a9e7ff', '#050527'], 'C', 'wings') },
  { id: 'dragon', name: 'Dragão KX', rarity: 'legendary', image: svgSkin('Dragon', ['#541018', '#ff5d45', '#1d0407'], 'D', 'flame') },
  { id: 'chrono', name: 'Cronos', rarity: 'legendary', image: svgSkin('Chrono', ['#143b50', '#67ffe0', '#061820'], 'C', 'target') },
  { id: 'titan', name: 'Titã Obsidiano', rarity: 'legendary', image: svgSkin('Titan', ['#090b16', '#8b9cff', '#000105'], 'T', 'crystal') }
];

export const CHESTS = {
  common: {
    id: 'common', name: 'Baú Comum', price: 120, accent: '#4ade80', guaranteed: false,
    odds: { none: 15, common: 72, rare: 11, epic: 1.8, legendary: 0.2 }
  },
  golden: {
    id: 'golden', name: 'Baú Dourado', price: 320, accent: '#facc15', guaranteed: false,
    odds: { none: 8, common: 40, rare: 42, epic: 9, legendary: 1 }
  },
  obsidian: {
    id: 'obsidian', name: 'Baú de Obsidiana', price: 700, accent: '#a78bfa', guaranteed: true,
    odds: { common: 15, rare: 45, epic: 35, legendary: 5 }
  }
};

export const SKIN_VALUES = { common: 120, rare: 320, epic: 700, legendary: 1200, custom: 1800 };
export const NO_SKIN = { id: 'none', name: 'Sem skin', rarity: 'none', image: '', value: 0 };
export const NO_PRIZE = { id: 'no_prize', name: 'Sem prêmio', rarity: 'none', image: svgSkin('Vazio', ['#222938', '#7b879b', '#070a10'], '—', 'eclipse'), noPrize: true };

export function getSkinValue(skin) {
  if (skin?.id === 'rookie') return 0;
  return SKIN_VALUES[skin?.rarity || (skin?.custom ? 'custom' : 'common')] || 120;
}

export function rollChest(chestId, random = Math.random) {
  const chest = CHESTS[chestId];
  if (!chest?.odds) throw new Error('Baú inválido.');
  const roll = Math.max(0, Math.min(0.999999, Number(random()) || 0)) * 100;
  let cumulative = 0;
  const rarity = Object.entries(chest.odds).find(([, percentage]) => {
    cumulative += percentage;
    return roll < cumulative;
  })?.[0] || Object.keys(chest.odds).at(-1);
  if (rarity === 'none') return NO_PRIZE;
  const pool = SKINS.filter(skin => skin.rarity === rarity);
  return pool[Math.floor(random() * pool.length)];
}

/** Returns the exact rarity odds used by the chest roll. */
export function getChestRarityChances(chestId) {
  const chest = CHESTS[chestId];
  if (!chest?.odds) return [];
  return Object.entries(chest.odds).map(([rarity, percentage]) => ({
    rarity,
    percentage
  }));
}

export function getSkinById(id) {
  if (id === NO_PRIZE.id) return NO_PRIZE;
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
