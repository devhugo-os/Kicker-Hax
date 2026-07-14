const STAFF_ROLES = {
  developer: { label: 'DEV', className: 'developer', color: '#38bdf8', textColor: '#031525' },
  influencer: { label: 'INFLUENCIADOR', className: 'influencer', color: '#facc15', textColor: '#211500' }
};

export function normalizeStaffRole(role) {
  const key = String(role || '').trim().toLowerCase();
  return STAFF_ROLES[key] ? key : '';
}

export function createStaffTag(role) {
  const key = normalizeStaffRole(role);
  if (!key) return null;
  const tag = document.createElement('span');
  tag.className = `staff-tag ${STAFF_ROLES[key].className}`;
  tag.textContent = STAFF_ROLES[key].label;
  tag.title = key === 'developer' ? 'Desenvolvedor oficial' : 'Influenciador oficial';
  return tag;
}

export function appendStaffTag(container, role) {
  const tag = createStaffTag(role);
  if (tag) container.appendChild(tag);
}

export function getStaffRoleMeta(role) {
  return STAFF_ROLES[normalizeStaffRole(role)] || null;
}

export function drawStaffTagOnCanvas(ctx, x, y, role) {
  const meta = getStaffRoleMeta(role);
  if (!meta) return;
  ctx.save();
  ctx.font = '800 8px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const width = Math.ceil(ctx.measureText(meta.label).width) + 10;
  ctx.fillStyle = meta.color;
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x - width / 2, y - 6, width, 12, 3);
    ctx.fill();
  } else {
    ctx.fillRect(x - width / 2, y - 6, width, 12);
  }
  ctx.fillStyle = meta.textColor;
  ctx.fillText(meta.label, x, y + 0.5);
  ctx.restore();
}
