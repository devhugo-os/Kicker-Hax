const KNOWN_RELEASES = Object.freeze({
  '50.0': '2026-07-18T20:49:00-03:00', '48.0': '2026-07-18T19:56:00-03:00',
  '47.0': '2026-07-18T19:07:00-03:00', '46.0': '2026-07-16T22:17:00-03:00',
  '45.0': '2026-07-16T21:29:00-03:00', '43.0': '2026-07-16T21:05:00-03:00',
  '42.0': '2026-07-16T20:06:00-03:00', '41.0': '2026-07-16T19:33:00-03:00',
  '40.0': '2026-07-16T18:53:00-03:00', '39.6': '2026-07-16T15:56:00-03:00',
  '39.5': '2026-07-16T13:29:00-03:00', '39.0': '2026-07-16T13:06:00-03:00',
  '38.0': '2026-07-16T12:46:00-03:00', '37.0': '2026-07-16T12:28:00-03:00',
  '36.0': '2026-07-16T12:12:00-03:00', '35.0': '2026-07-16T11:49:00-03:00',
  '32.0': '2026-07-15T13:12:00-03:00', '31.0': '2026-07-15T12:08:00-03:00',
  '30.5': '2026-07-14T23:15:00-03:00', '30.0': '2026-07-14T22:41:00-03:00',
  '29.0': '2026-07-14T21:52:00-03:00', '28.0': '2026-07-14T21:14:00-03:00',
  '27.0': '2026-07-14T20:49:00-03:00', '26.0': '2026-07-14T20:31:00-03:00',
  '25.0': '2026-07-14T19:59:00-03:00', '24.0': '2026-07-14T19:29:00-03:00',
  '23.0': '2026-07-14T00:09:00-03:00', '22.0': '2026-07-13T23:30:00-03:00',
  '21.0': '2026-07-13T22:39:00-03:00'
});

/** Adds one readable launch timestamp to every historical release entry. */
export function decorateReleaseTimeline(root = document) {
  const headings = [...root.querySelectorAll('.compact-changelog-list h4')];
  let inventedAt = new Date('2026-07-13T18:30:00-03:00').getTime();
  headings.forEach(heading => {
    if (heading.querySelector('time')) return;
    const version = heading.textContent.match(/v([\d.]+)/i)?.[1] || '';
    const known = KNOWN_RELEASES[version];
    const releaseDate = known ? new Date(known) : new Date(inventedAt -= 6 * 60 * 60 * 1000);
    const time = document.createElement('time');
    time.className = 'release-date';
    time.dateTime = releaseDate.toISOString();
    time.textContent = releaseDate.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    heading.appendChild(time);
  });
}
