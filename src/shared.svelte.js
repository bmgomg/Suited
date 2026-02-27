import { sampleSize } from 'lodash-es';
import { CARDS } from './Cards';
import { APP_STATE } from './const';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { _range, post } from './utils';

export const _log = (value) => console.log($state.snapshot(value));

export const appKey = () => `${APP_STATE} • ${ss.mode}`;

export const persist = () => {
    let json = JSON.stringify({ sfx: _sound.sfx, music: _sound.music });
    localStorage.setItem(APP_STATE, json);

    json = JSON.stringify({ ..._stats, cells: ss.cells, points: ss.points, over: ss.over, tray: ss.tray });
    localStorage.setItem(appKey(), json);
};

const loadCommon = () => {
    const json = localStorage.getItem(APP_STATE);
    const job = JSON.parse(json);

    if (job) {
        _sound.sfx = job.sfx;
        _sound.music = job.music;
    }
};

const loadGame = () => {
    const json = localStorage.getItem(appKey());
    const job = JSON.parse(json);

    if (job) {
        _stats.plays = job.plays;
        _stats.total = job.total;
        _stats.best = job.best;

        const over = job.over;
        ss.points = over ? 0 : job.points;
        ss.cells = over ? null : job.cells;
        ss.tray = over ? null : job.tray;
    } else {
        _stats.plays = 0;
        _stats.total = 0;
        _stats.best = 0;
        ss.points = 0;

        delete ss.cells;
        delete ss.tray;
    }
};

export const showIntro = (value, plop = true) => {
    plop && _sound.play('plop');
    ss.home = true;
};

const decode = card => ({ suite: Math.floor(card / 100), rank: card % 100 });

const isGoodNeighbor = (c1, c2) => {
    if (!c1 || !c2) {
        return true;
    }

    const { suite: s1, rank: r1 } = decode(c1);
    const { suite: s2, rank: r2 } = decode(c2);

    return s1 === s2 || r1 === r2;
};

export const isSolved = (codes) => {
    if (!codes) {
        codes = ss.cells?.map(c => c.code) || [];
    }

    // check all horizontal and vertical adjacencies
    for (let i = 0; i < ss.cellCount; i++) {
        const r = Math.floor(i / ss.cols);
        const c = i % ss.cols;

        // check right neighbor
        if (c < ss.cols - 1 && !isGoodNeighbor(codes[i], codes[i + 1])) {
            return false;
        }

        // check down neighbor
        if (r < ss.rows - 1 && !isGoodNeighbor(codes[i], codes[(r + 1) * ss.cols + c])) {
            return false;
        }
    }

    return true;
};

export const inGoodPlace = (idx, codes) => {
    if (!codes) {
        codes = ss.cells.map(c => c.code);
    }

    const positions = _range(0, ss.cellCount - 1);
    const row = Math.floor(positions[idx] / ss.cols);
    const col = positions[idx] % ss.cols;

    const up = row > 0 ? codes[(row - 1) * ss.cols + col] : null;
    const down = row < ss.rows - 1 ? codes[(row + 1) * ss.cols + col] : null;
    const left = col > 0 ? codes[row * ss.cols + (col - 1)] : null;
    const right = col < ss.cols - 1 ? codes[row * ss.cols + (col + 1)] : null;

    const code = codes[idx];

    if (isGoodNeighbor(code, up) && isGoodNeighbor(code, down) && isGoodNeighbor(code, left) && isGoodNeighbor(code, right)) {
        return true;
    }

    return false;
};

const makeTray = () => {
    const count = Math.min(ss.traySize, ss.deck.length);
    const hand = sampleSize(ss.deck, count);

    for (let i = 0; i < count; i++) {
        ss.tray[i].code = hand[i];
    }

    ss.deck = ss.deck.filter(code => !ss.tray.some(c => c.code === code));
};

export const makePuzzle = () => {
    ss.cells = Array(ss.cellCount).fill(null).map((_, index) => ({ code: 0, index }));
    ss.deck = Object.keys(CARDS).map(k => +k);
    ss.tray = Array(ss.traySize).fill(null).map((_, index) => ({ code: 0, index, tray: true }));

    makeTray();
    onStart();
};

export const onStart = (chime = 'dice') => {
    _sound.play(chime);

    if (!_sound.musicPlayed) {
        post(() => _sound.playMusic(), 1000);
    }

    delete ss.over;
    persist();
};

export const onMode = (mode) => {
    _prompt.opacity = 0;

    ss.mode = mode;

    ss.cols = 12;
    ss.rows = 8;
    ss.cellCount = ss.cols * ss.rows;
    ss.traySize = 5;

    _sound.play('plop');

    loadCommon();
    loadGame();

    if (!ss.cells) {
        makePuzzle();
    }

    delete ss.home;
};
