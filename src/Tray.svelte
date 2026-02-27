<script>
	import Cell from './Cell.svelte';
	import { CELL_MARGIN, CELL_WIDTH } from './const';
	import { ss } from './state.svelte';
	import { _range } from './utils';
</script>

<div class="tray" style="translate: {((ss.traySize - ss.cols) / 2) * (CELL_WIDTH + CELL_MARGIN * 2)}px 0;">
	{#each _range(1, ss.traySize) as index (index)}
		<Cell cell={ss.tray[index - 1]} />
	{/each}
</div>

<style>
	.tray {
		grid-area: 1/1;
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		z-index: 1;
	}
</style>
