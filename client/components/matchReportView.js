import { Team } from '../../shared/constants.js';
import { buildMatchReport } from '../../shared/matchReport.js';

const TEAM_META = {
  [Team.RED]: { label: 'Time Vermelho', className: 'red' },
  [Team.BLUE]: { label: 'Time Azul', className: 'blue' }
};

function cell(text, className = '') {
  const element = document.createElement('span');
  element.className = className;
  element.textContent = text;
  return element;
}

function renderTeamSummary(report, team) {
  const data = report.teamStats?.[team] || {};
  const meta = TEAM_META[team];
  const section = document.createElement('section');
  section.className = `match-report-team match-report-team-${meta.className}`;
  const heading = document.createElement('h4');
  heading.textContent = meta.label;
  const score = document.createElement('strong');
  score.className = 'match-report-team-score';
  score.textContent = String(data.score ?? (team === Team.RED ? report.score.red : report.score.blue) ?? 0);
  const stats = document.createElement('div');
  stats.className = 'match-report-team-stats';
  [
    ['Posse', `${data.possessionPct || 0}%`], ['Chutes', data.shots || 0],
    ['Assist.', data.assists || 0], ['Dribles', data.dribbles || 0], ['Desarmes', data.tackles || 0]
  ].forEach(([label, value]) => {
    const row = document.createElement('div');
    row.append(cell(label), cell(String(value), 'match-report-value'));
    stats.appendChild(row);
  });
  section.append(heading, score, stats);
  return section;
}

function renderPlayers(report, mvp) {
  const section = document.createElement('section');
  section.className = 'match-report-players';
  const heading = document.createElement('h4');
  heading.textContent = 'Jogadores e notas';
  const table = document.createElement('div');
  table.className = 'match-report-table';
  const header = document.createElement('div');
  header.className = 'match-report-row match-report-header';
  ['Jogador', 'Nota', 'G', 'A', 'C', 'D', 'T', 'Posse'].forEach(label => header.appendChild(cell(label)));
  table.appendChild(header);

  report.playerStats
    .slice()
    .sort((a, b) => (a.team - b.team) || (b.rating - a.rating) || String(a.username).localeCompare(String(b.username)))
    .forEach(player => {
      const row = document.createElement('div');
      row.className = `match-report-row team-${player.team === Team.RED ? 'red' : 'blue'}`;
      const isMvp = mvp && (mvp.uid === player.uid || mvp.playerId === player.playerId);
      row.append(
        cell(`${isMvp ? 'MVP · ' : ''}${player.username || 'Jogador'}`, 'match-report-player'),
        cell(Number(player.rating || 0).toFixed(1), 'match-report-rating'),
        cell(String(player.goals || 0)), cell(String(player.assists || 0)),
        cell(String(player.shots || 0)), cell(String(player.dribbles || 0)),
        cell(String(player.tackles || 0)), cell(`${player.possessionPct || 0}%`)
      );
      table.appendChild(row);
    });
  section.append(heading, table);
  return section;
}

/** Renders the same authoritative report on post-game and history screens. */
export function renderMatchReport(container, result = {}) {
  if (!container) return;
  const report = buildMatchReport(result);
  container.replaceChildren();
  container.classList.toggle('match-report-empty', report.playerStats.length === 0);
  if (!report.playerStats.length) {
    container.textContent = 'Este registro antigo não possui estatísticas detalhadas.';
    return;
  }
  const teams = document.createElement('div');
  teams.className = 'match-report-teams';
  teams.append(renderTeamSummary(report, Team.RED), renderTeamSummary(report, Team.BLUE));
  container.append(teams, renderPlayers(report, result.mvp));
}
