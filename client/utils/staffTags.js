const STAFF_ROLES = {
  developer: { label: 'DEV', className: 'developer' },
  influencer: { label: 'INFLUENCIADOR', className: 'influencer' }
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
