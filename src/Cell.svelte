<script>
	import { CARDS } from './Cards';
	import { CELL_MARGIN, CELL_WIDTH } from './const';
	import { _sound } from './sound.svelte';
	import { _prompt, ss } from './state.svelte';

	const { cell } = $props();
	const { index, code } = $derived(cell);
	const idx = $derived(Math.abs(index));
	let _this = $state(null);
	const { row, col } = $derived(rowCol(index));

	const img = $derived(CARDS[+code]);

	const rowCol = (idx) => {
		const row = Math.floor(idx / ss.cols) + 1;
		const col = (idx % ss.cols) + 1;
		return { row, col };
	};

	const onPointerDown = () => {
		_prompt.opacity = 0;

		_sound.play('click');

		if (ss.from === index) {
			delete ss.from;
			return;
		}

		if (ss.from + 1) {
			ss.to = index;
		} else {
			ss.from = index;
		}
	};

	$effect(() => {
		const onTransitionEnd = (e) => {
			if (e.propertyName !== 'translate') {
				return;
			}

			if (index === ss.swap1 && ss.swap2 + 1) {
				const doSwap = () => {
					_sound.play('cluck');

					const ch1 = ss.cells[ss.swap1].code;
					const ch2 = ss.cells[ss.swap2].code;
					ss.cells[ss.swap1].code = ch2;
					ss.cells[ss.swap2].code = ch1;

					delete ss.swap1;
					delete ss.swap2;

					if (isSolved()) {
						post(() => _sound.play('won', { rate: 2 }), 150);

						if (ss.timer) {
							onTaskCompleted();
							ss.points += calcPoints();

							persist();
						}

						post(() => (ss.flip = true), 1000);
					} else if (ss.timer) {
						onFail();
					}

					stopTimer();
				};

				doSwap();
			}
		};

		_this.addEventListener('transitionend', onTransitionEnd);
		return () => _this.removeEventListener('transitionend', onTransitionEnd);
	});
</script>

<div bind:this={_this} class="cell" style="grid-area: {row}/{col}; width: {CELL_WIDTH}px; margin: {CELL_MARGIN}px;">
	<div class="spot"></div>
	{#if code}
		<div class="card">
			<img src={img} alt="" width="100%" />
		</div>
	{/if}
</div>

<style>
	.cell {
		display: grid;
	}

	.card,
	.spot {
		grid-area: 1/1;
		display: grid;
		aspect-ratio: 0.72;
		box-sizing: border-box;
		border-radius: 5px;
	}

	.card {
		place-content: center;
		font-size: 36px;
		background: var(--ow);
		transition: translate 0.5s linear;
	}

	.spot {
		border: 2px solid white;
		opacity: 0.15;
	}
</style>
