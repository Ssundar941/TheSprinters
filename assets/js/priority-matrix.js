// Priority × effort matrix: a team board's open cards sorted by how much they
// matter (rows: High, Medium, Low) and how much work they are (columns: Small,
// Medium, Large).
//
//   {% include ocs_priority_matrix.html url="https://github.com/orgs/UGRC-CSA/projects/1" filter="Team" sizes=site.data.communication_system_task_sizes %}
//
// The cards come from the kanban board on the same page (kanban-board.js),
// never a second request to GitHub: the matrix draws the board's saved copy
// and every board the kanban draws after it, and asks the kanban to load as
// soon as the matrix scrolls near the screen. Priority is the board's Priority
// field. Effort comes from the sizes data, since the board has no effort field;
// a sizes entry's priority stands in, outlined as a suggestion, while a card has
// none on the board. Done cards are left out.
//
// Each priority row is a row of kanban columns, one per effort, holding kanban
// cards (ocs__kanban-board, ocs__kanban-column, ocs__kanban-item), so the matrix
// looks like the board under it. The filters are existing OCS elements
// (ocs__links, ocs__btn, ocs__status-pill); the row layout and row labels are
// the ocs__matrix element (_sass/open-coding/elements/priority-matrix/).

import { boardCacheKey, filterCards, loadBoardNow, parseBoardUrl, readEntry } from './kanban-board.js';

export const PRIORITIES = ['High', 'Medium', 'Low'];
export const EFFORTS = ['S', 'M', 'L'];
const EFFORT_NAMES = { S: 'Small', M: 'Medium', L: 'Large' };
const STAGE_NAMES = { backlog: 'Backlog', todo: 'To do', doing: 'In progress', review: 'In review' };

// "high", " High " and "HIGH" are all High; anything else is no value.
const pick = (allowed, value) => allowed.find((name) => name.toLowerCase() === String(value ?? '').trim().toLowerCase()) || null;

export const cellKey = (priority, effort) => `${priority}|${effort}`;

// Every open card in its cell, or in `unsorted` while it has no effort or no
// priority. A card keeps the board's priority when it has one; otherwise its
// sizes entry's priority, marked as a suggestion.
export function placeCards(cards, sizes = {}) {
  const entries = new Map((sizes.Cards || []).map((entry) => [String(entry.id), entry]));
  const cells = new Map();
  const unsorted = [];
  for (const card of cards) {
    if (card.stage === 'done') continue;
    const entry = entries.get(String(card.id)) || {};
    const boardPriority = pick(PRIORITIES, card.priority);
    const priority = boardPriority || pick(PRIORITIES, entry.priority);
    const effort = pick(EFFORTS, entry.effort);
    const placed = { ...card, priority, effort, suggested: !boardPriority && Boolean(priority) };
    if (!priority || !effort) {
      unsorted.push(placed);
      continue;
    }
    const key = cellKey(priority, effort);
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(placed);
  }
  return { cells, unsorted };
}

/* ── Drawing ─────────────────────────────────────────────────────────── */

// A full cell shows as many cards as a kanban column, then a pill for the rest.
const PER_CELL = 5;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const countPill = (count) => el('span', 'ocs__status-pill ocs__status-pill--neutral', String(count));

function setStatus(section, text) {
  const status = section.querySelector('[data-hook="status"]');
  status.textContent = text;
  status.hidden = !text;
}

// One task as a kanban card: its team (when every team is showing), its name,
// and its column on the board.
function taskCard(card, showGroup) {
  const link = el('a', `ocs__kanban-item${card.suggested ? ' is-suggested' : ''}`);
  link.href = card.url;
  link.target = '_blank';
  link.rel = 'noopener';
  if (showGroup && card.group) link.appendChild(el('div', 'ocs__kanban-kicker', card.group));
  link.appendChild(el('div', 'ocs__kanban-name', card.title));
  const stage = STAGE_NAMES[card.stage] || card.status;
  link.appendChild(el('div', 'ocs__kanban-note', card.suggested ? `${stage} · suggested priority` : stage));
  if (card.suggested) link.title = `Suggested priority: ${card.priority}. Set it on the board to confirm.`;
  return link;
}

// One cell as a kanban column: the effort and its count, how long that
// usually takes, then its cards.
function effortColumn(cards, effort, hint, { expanded, onToggle, showGroup, key }) {
  const column = el('li', 'ocs__kanban-column');
  const heading = el('div');
  heading.append(el('strong', '', EFFORT_NAMES[effort]), ' ', countPill(cards.length));
  column.appendChild(heading);
  if (hint) column.appendChild(el('div', 'ocs__kanban-note', hint));
  if (!cards.length) column.appendChild(el('div', 'ocs__text', 'Nothing here'));
  (expanded ? cards : cards.slice(0, PER_CELL)).forEach((card) => column.appendChild(taskCard(card, showGroup)));
  if (cards.length > PER_CELL) {
    const more = el('button', 'ocs__status-pill ocs__status-pill--neutral ocs__matrix-more', expanded ? 'Show less' : `+${cards.length - PER_CELL} more`);
    more.type = 'button';
    more.dataset.cell = key;
    more.setAttribute('aria-expanded', String(expanded));
    more.addEventListener('click', () => onToggle(key));
    // ocs__keypoint keeps the pill its own width instead of the column's.
    const row = el('div', 'ocs__keypoint');
    row.appendChild(more);
    column.appendChild(row);
  }
  return column;
}

// One priority: its label on the left, then a column for each effort.
function priorityRow(priority, placed, efforts, view) {
  const row = el('div', 'ocs__matrix-row');
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', `${priority} priority`);
  const total = EFFORTS.reduce((sum, effort) => sum + (placed.cells.get(cellKey(priority, effort)) || []).length, 0);
  const label = el('div', 'ocs__matrix-label');
  label.append(el('strong', '', priority), el('span', 'ocs__text', 'priority'), countPill(total));
  const board = el('ul', 'ocs__kanban-board ocs__matrix-board');
  EFFORTS.forEach((effort) => {
    const key = cellKey(priority, effort);
    board.appendChild(effortColumn(placed.cells.get(key) || [], effort, efforts[effort], {
      ...view, key, expanded: view.open.has(key),
    }));
  });
  row.append(label, board);
  return row;
}

// A matrix drawn into its section. It keeps the chosen team and the expanded
// cells across refreshes.
function matrixView(section, sizes) {
  const mount = section.querySelector('[data-hook="mount"]');
  const meta = section.querySelector('[data-hook="meta"]');
  const state = { group: 'all', open: new Set() };
  let board = null;

  function controls() {
    const row = el('div', 'ocs__links');
    if (board.groups.length < 2) return null;
    row.appendChild(el('span', 'ocs__text', board.filterName));
    [['all', 'All'], ...board.groups.map((group) => [group, group])].forEach(([value, label]) => {
      const on = state.group === value;
      const button = el('button', `ocs__btn small pill${on ? ' accent fill' : ''}`, label);
      button.type = 'button';
      button.dataset.group = value;
      button.setAttribute('aria-pressed', String(on));
      button.addEventListener('click', () => {
        state.group = value;
        render();
        mount.querySelector(`button[data-group="${CSS.escape(value)}"]`)?.focus();
      });
      row.appendChild(button);
    });
    return row;
  }

  function toggleCell(key) {
    if (state.open.has(key)) state.open.delete(key);
    else state.open.add(key);
    render();
    mount.querySelector(`button[data-cell="${CSS.escape(key)}"]`)?.focus();
  }

  function render() {
    if (!board.groups.includes(state.group)) state.group = 'all';
    const showGroup = state.group === 'all';
    const placed = placeCards(filterCards(board, state.group), sizes);
    const open = [...placed.cells.values()].reduce((sum, cards) => sum + cards.length, 0) + placed.unsorted.length;
    meta.textContent = `${open} open task${open === 1 ? '' : 's'}`;

    const rows = el('div', 'ocs__matrix-rows');
    const view = { open: state.open, onToggle: toggleCell, showGroup };
    PRIORITIES.forEach((priority) => rows.appendChild(priorityRow(priority, placed, sizes.Efforts || {}, view)));
    const parts = [controls(), rows];
    if (placed.unsorted.length) {
      const tray = el('div', 'ocs__matrix-tray');
      tray.appendChild(el('strong', '', `Not sorted yet (${placed.unsorted.length}): give these cards an effort`));
      const list = el('div', 'ocs__matrix-tray-list');
      placed.unsorted.forEach((card) => list.appendChild(taskCard(card, showGroup)));
      tray.appendChild(list);
      parts.push(tray);
    }
    mount.replaceChildren(...parts.filter(Boolean));
    mount.hidden = false;
  }

  return {
    show(next) {
      board = next;
      render();
      setStatus(section, '');
    },
  };
}

function mountMatrix(section) {
  const filterName = section.dataset.filter || '';
  const ref = parseBoardUrl(section.dataset.boardUrl || '');
  const kanban = [...document.querySelectorAll('[data-ocs-kanban]')]
    .find((board) => board.dataset.boardUrl === section.dataset.boardUrl && (board.dataset.filter || '') === filterName);
  if (!ref || !kanban) {
    setStatus(section, 'The matrix sorts the cards of the project board on this page, and this page has none with the same address.');
    return;
  }
  let sizes = {};
  try {
    sizes = JSON.parse(section.querySelector('[data-hook="sizes"]')?.textContent || '{}') || {};
  } catch (err) {
    console.error('Priority matrix: the sizes data is not valid JSON', err);
  }
  const view = matrixView(section, sizes);
  kanban.addEventListener('ocs-kanban:board', (event) => view.show(event.detail.board));
  const saved = readEntry(boardCacheKey(ref, filterName));
  if (saved?.board) view.show(saved.board);
  else setStatus(section, 'Waiting for the project board below to load from GitHub…');

  // Load the board as soon as the matrix is near, even while the board itself
  // is further down the page.
  if (!('IntersectionObserver' in window)) {
    loadBoardNow(kanban);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    loadBoardNow(kanban);
  }, { rootMargin: '400px 0px' });
  observer.observe(section);
}

if (typeof document !== 'undefined') {
  const mountAll = () => document.querySelectorAll('[data-ocs-priority-matrix]').forEach(mountMatrix);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll);
  else mountAll();
}
