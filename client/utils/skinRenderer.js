const cache = new Map();

export function drawSkinImage(ctx, source, x, y, radius) {
  // "custom" is a realtime transport placeholder, not an image URL.
  if (!source || source === 'custom' || !/^(data:image\/|blob:|https?:\/\/|\/|\.\/|\.\.\/)/i.test(source)) return false;
  let image = cache.get(source);
  if (!image) {
    image = new Image();
    image.decoding = 'async';
    image.src = source;
    cache.set(source, image);
    return false;
  }
  if (!image.complete || !image.naturalWidth) return false;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(image, x - radius, y - radius, radius * 2, radius * 2);
  ctx.restore();
  return true;
}
