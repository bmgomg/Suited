import { keys, sampleSize } from 'lodash-es';
import { SvelteSet } from 'svelte/reactivity';
import { CARDS } from './Cards';
import { APP_STATE, LEVEL_SECS, MAX_STRIKES, MODE_PRACITCE, PROMPT_PLAY_AGAIN, TASKS_PER_LEVEL, TICK_MS } from './const';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { _range, post, shuffleInPlace } from './utils';

export const _log = (value) => console.log($state.snapshot(value));

export const appKey = () => `${APP_STATE} • ${ss.mode}`;

export const persist = () => {
    let json = JSON.stringify({ sfx: _sound.sfx, music: _sound.music });
    localStorage.setItem(APP_STATE, json);

    if (ss.practice) {
        json = JSON.stringify({ largePractice: ss.largePractice });
    } else {
        json = JSON.stringify({ ..._stats, level: ss.level, cells: ss.cells, ticks: ss.ticks, tasks: ss.tasks, points: ss.points, strikes: ss.strikes, over: ss.over, levelComplete: ss.levelComplete, fail: ss.fail });
    }

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

const loadPracticeOps = () => {
    const json = localStorage.getItem(appKey());
    const job = JSON.parse(json);

    if (job) {
        ss.largePractice = job.largePractice;
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
        const levelComplete = job.levelComplete;

        ss.level = over ? 1 : job.level;
        ss.fail = job.fail && (!over && !levelComplete);
        ss.ticks = over || levelComplete || ss.fail ? 0 : -job.ticks;
        ss.tasks = over ? 0 : job.tasks;
        ss.points = over ? 0 : job.points;
        ss.strikes = over || levelComplete ? 0 : job.strikes;
        ss.cells = over || levelComplete || !ss.ticks || ss.fail ? null : job.cells;
    } else {
        _stats.plays = 0;
        _stats.total = 0;
        _stats.best = 0;
        ss.level = 1;
        ss.ticks = 0;
        ss.tasks = 0;
        ss.points = 0;
        ss.strikes = 0;

        delete ss.cells;
    }
};

export const showIntro = (value, plop = true) => {
    plop && _sound.play('plop');
    ss.home = true;
    stopTimer();
};

const decode = card => ({ suite: Math.floor(card / 100), rank: card % 100 });

const isGoodNeighbor = (c1, c2) => {
    if (!c1 || !c2) {
        return true;
    }

    const { rank: r1 } = decode(c1);
    const { rank: r2 } = decode(c2);

    if (Math.abs(r1 - r2) < 2) {
        return false;
    }

    return true;
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

const makeMatrix = () => {
    const codes = keys(CARDS).map(code => +code);

    const mx = Array(ss.cellCount).fill(null);
    const used = new SvelteSet();
    const positions = _range(0, ss.cellCount - 1);

    const backtrack = (idx) => {
        if (idx === ss.cellCount) {
            return true;
        }

        const candidates = codes.slice();
        shuffleInPlace(candidates);

        for (const code of candidates) {
            if (used.has(code)) {
                continue;
            }

            const row = Math.floor(positions[idx] / ss.cols);
            const col = positions[idx] % ss.cols;

            const up = row > 0 ? mx[(row - 1) * ss.cols + col] : null;
            const down = row < ss.rows - 1 ? mx[(row + 1) * ss.cols + col] : null;
            const left = col > 0 ? mx[row * ss.cols + (col - 1)] : null;
            const right = col < ss.cols - 1 ? mx[row * ss.cols + (col + 1)] : null;

            if (isGoodNeighbor(code, up) && isGoodNeighbor(code, down) && isGoodNeighbor(code, left) && isGoodNeighbor(code, right)) {
                mx[positions[idx]] = code;
                used.add(code);

                if (backtrack(idx + 1)) {
                    return mx;
                }

                used.delete(code);
                mx[positions[idx]] = null;
            }
        }

        return false;
    };

    const success = backtrack(0);

    if (!success) {
        throw new Error('Could not generate a valid grid');
    }

    return mx;
};

const doMakePuzzle = () => {
    const mx = makeMatrix();
    let codes;

    do {
        codes = [...mx];
        const ids = sampleSize(_range(0, ss.cellCount - 1), 2);
        const code = codes[ids[0]];
        codes[ids[0]] = codes[ids[1]];
        codes[ids[1]] = code;
    } while (isSolved(codes));

    ss.cells = codes.map((code, index) => ({ code, index }));
};

export const stopTimer = () => {
    clearInterval(ss.timer);
    delete ss.timer;
};

const onTick = () => {
    ss.ticks++;

    if (!ss.practice) {
        if (secsRemained() <= 0) {
            stopTimer();
            onFail();
        }

        persist();
    }
};

export const onFail = () => {
    _sound.play('lost');

    if (ss.practice) {
        return;
    }

    ss.fail = true;
    ss.strikes++;

    onTaskCompleted();

    persist();

    if (ss.strikes === MAX_STRIKES) {
        _prompt.set(PROMPT_PLAY_AGAIN);
    }
};

export const onTaskCompleted = () => {
    ss.tasks++;

    if (ss.strikes === MAX_STRIKES) {
        ss.over = true;

        _stats.plays++;
        _stats.total += ss.points;

        if (ss.points > _stats.best) {
            _stats.best = ss.points;
        }

        return;
    }

    if (levelComplete()) {
        ss.levelComplete = true;
        ss.level++;
    }
};

const levelComplete = () => ss.tasks % TASKS_PER_LEVEL === 0;

export const calcPoints = () => LEVEL_SECS[0] - elapsedSecs();

export const elapsedSecs = () => Math.round(((ss.ticks || 0) * TICK_MS) / 1000);

export const secsRemained = () => {
    const level = Math.min(ss.level - (ss.levelComplete ? 1 : 0), LEVEL_SECS.length);
    const maxSecs = LEVEL_SECS[level - 1];

    if (ss.levelPrompt) {
        return maxSecs;
    }

    const elapsed = elapsedSecs();
    return Math.max(0, maxSecs - elapsed);
};

export const makePuzzle = () => {
    delete ss.fail;

    doMakePuzzle();

    if (!ss.practice && ss.tasks % TASKS_PER_LEVEL === 0) {
        _sound.play('won');
        ss.levelPrompt = true;
        ss.strikes = 0;
    } else {
        onStart();
    }
};

export const onStart = (chime = 'dice') => {
    stopTimer();
    _sound.play(chime);

    if (!_sound.musicPlayed) {
        post(() => _sound.playMusic(), 1000);
    }

    if (!ss.practice) {
        delete ss.over;
        delete ss.levelComplete;

        persist();
    }

    ss.ticks = !ss.practice && ss.ticks < 0 ? -ss.ticks : 0;
    ss.delay = true;

    post(() => {
        ss.timer = setInterval(onTick, TICK_MS);
        post(() => delete ss.delay, 500);
    }, 500);
};

export const onMode = (mode) => {
    _prompt.opacity = 0;

    ss.mode = mode;
    ss.practice = mode === MODE_PRACITCE;

    if (ss.practice) {
        loadPracticeOps();

        ss.cols = ss.largePractice ? 5 : 4;
        ss.rows = ss.largePractice ? 4 : 3;
    } else {
        ss.cols = 5;
        ss.rows = 4;
    }

    ss.cellCount = ss.cols * ss.rows;

    _sound.play('plop');

    loadCommon();

    if (ss.practice) {
        makePuzzle();
    } else {
        loadGame();

        if (!ss.cells) {
            doMakePuzzle();
        }

        ss.levelPrompt = true;
    }

    delete ss.home;
};
