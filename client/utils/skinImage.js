import { SKIN_IMAGE_MAX_BYTES } from '../../shared/constants.js';

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export function detectSkinImageType(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
  if (PNG_SIGNATURE.every((value, index) => data[index] === value)) return 'image/png';
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'image/jpeg';
  return null;
}

export async function validateSkinImageFile(file) {
  if (!file) return null;
  const detected = detectSkinImageType(await file.slice(0, 8).arrayBuffer());
  const declared = String(file.type || '').toLowerCase();
  return detected && (!declared || declared === detected || (detected === 'image/jpeg' && declared === 'image/jpg')) ? detected : null;
}

export function getBase64DataUrlBytes(dataUrl) {
  const encoded = String(dataUrl || '').split(',', 2)[1] || '';
  if (!encoded) return 0;
  const padding = encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor(encoded.length * 3 / 4) - padding);
}

export function encodeSkinCanvas(canvas, mimeType, maxBytes = SKIN_IMAGE_MAX_BYTES) {
  if (!canvas || !['image/png', 'image/jpeg'].includes(mimeType)) return null;
  if (mimeType === 'image/png') {
    const png = canvas.toDataURL('image/png');
    return getBase64DataUrlBytes(png) <= maxBytes ? png : null;
  }
  for (const quality of [0.9, 0.82, 0.72, 0.6, 0.48]) {
    const jpeg = canvas.toDataURL('image/jpeg', quality);
    if (getBase64DataUrlBytes(jpeg) <= maxBytes) return jpeg;
  }
  return null;
}
