<script>
	import { CARDS } from './Cards';
	import { CELL_MARGIN, CELL_WIDTH } from './const';
	import { _sound } from './sound.svelte';
	import { _prompt, ss } from './state.svelte';
	import { clientRect } from './utils';

	const { cell } = $props();
	const { index, code, tray } = $derived(cell);
	const id = $derived(`${tray ? 'tray' : 'cell'}-${index}`);
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

		if (ss.from === id) {
			delete ss.from;
			return;
		}

		if (!ss.from || tray) {
			if (code) {
				ss.from = id;
			}

			return;
		}

		if (code) {
			ss.from = id;
			return;
		}

		ss.to = id;
	};

	$effect(() => {
		const onTransitionEnd = (e) => {
			if (e.propertyName !== 'translate') {
				return;
			}

			//
		};

		_this.addEventListener('transitionend', onTransitionEnd);
		return () => _this.removeEventListener('transitionend', onTransitionEnd);
	});

	const off = $derived.by(() => {
		if (!ss.from || !ss.to) {
			return [0, 0];
		}

		if (id !== ss.from && id !== ss.to) {
			return [0, 0];
		}

		const r1 = clientRect('#' + ss.from);
		const r2 = clientRect('#' + ss.to);

		const dx = r2.x - r1.x;
		const dy = r2.y - r1.y;

		return [dx, dy];
	});

	const zi = $derived(id === ss.from ? 1 : 0);
	const duration = $derived(ss.from ? '1s' : '0s');

	const style = $derived(
		`grid-area: ${row}/${col}; width: ${CELL_WIDTH}px; margin: ${CELL_MARGIN}px;  z-index: ${zi};`
	);

	const disabled = $derived.by(() => {
		if (!ss.from) {
			return !code;
		}

		return false;
	});
</script>

<div {id} bind:this={_this} class="cell {disabled ? 'disabled' : ''}" {style} onpointerdown={onPointerDown}>
	<div class="spot"></div>
	{#if code}
		<div class="card {id === ss.from && !ss.to ? 'pulse' : ''}" style='translate: {off[0]}px {off[1]}px; transition-duration: {duration};'>
			<img src={img} alt="" width="100%" />
		</div>
	{/if}
</div>

<style>
	.cell {
		display: grid;
		cursor: pointer;
	}

	.disabled {
		pointer-events: none;
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

	.pulse {
		animation: pulse 0.2s alternate infinite ease-in-out;
	}

	@keyframes pulse {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(0.9);
		}
	}
</style>
