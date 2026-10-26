import { test } from 'node:test';
import assert from 'node:assert/strict';

import { EFFORTS, PRIORITIES, cellKey, placeCards } from '../assets/js/priority-matrix.js';

// Cards shaped like kanban-board.js's normalized board cards.
const card = (id, fields = {}) => ({ id, title: `Card ${id}`, stage: 'todo', priority: '', group: 'Chat + Calendar', ...fields });
const sizes = (...cards) => ({ Cards: cards });
const titles = (cards = []) => cards.map((c) => c.title);

test('the grid is three priorities by three efforts, high priority and small first', () => {
    assert.deepEqual(PRIORITIES, ['High', 'Medium', 'Low']);
    assert.deepEqual(EFFORTS, ['S', 'M', 'L']);
});

test('a card lands in the cell for its board priority and its effort', () => {
    const { cells, unsorted } = placeCards(
        [card(1, { priority: 'High' }), card(2, { priority: 'Low' })],
        sizes({ id: 1, effort: 'S' }, { id: '2', effort: 'L' }),
    );
    assert.deepEqual(titles(cells.get(cellKey('High', 'S'))), ['Card 1']);
    assert.deepEqual(titles(cells.get(cellKey('Low', 'L'))), ['Card 2']);
    assert.equal(unsorted.length, 0);
});

test('the board\'s priority wins; a sizes priority is only a suggestion while the board has none', () => {
    const { cells } = placeCards(
        [card(1, { priority: 'Medium' }), card(2)],
        sizes({ id: 1, effort: 'S', priority: 'Low' }, { id: 2, effort: 'S', priority: 'High' }),
    );
    const [onBoard] = cells.get(cellKey('Medium', 'S'));
    const [suggested] = cells.get(cellKey('High', 'S'));
    assert.equal(onBoard.suggested, false);
    assert.equal(suggested.suggested, true);
    assert.equal(cells.has(cellKey('Low', 'S')), false);
});

test('values match in any case and with stray spaces', () => {
    const { cells } = placeCards([card(1, { priority: ' high ' })], sizes({ id: 1, effort: 'l' }));
    assert.deepEqual(titles(cells.get(cellKey('High', 'L'))), ['Card 1']);
});

test('cards without an effort the grid has, or without any priority, wait under "not sorted yet"', () => {
    const { cells, unsorted } = placeCards(
        [card(1, { priority: 'High' }), card(2), card(3, { priority: 'Low' })],
        sizes({ id: 2, effort: 'M' }, { id: 3, effort: 'XL' }),
    );
    assert.equal(cells.size, 0);
    assert.deepEqual(titles(unsorted), ['Card 1', 'Card 2', 'Card 3']);
});

test('done cards are left out', () => {
    const { cells, unsorted } = placeCards([card(1, { priority: 'High', stage: 'done' })], sizes({ id: 1, effort: 'S' }));
    assert.equal(cells.size, 0);
    assert.equal(unsorted.length, 0);
});
