<script>
	import Cell from './Cell.svelte';
	import { CELL_MARGIN, CELL_WIDTH } from './const';
	import { ss } from './state.svelte';

</script>

<div class="tray" style='translate: {(ss.traySize - ss.cols) / 2 * (CELL_WIDTH + CELL_MARGIN * 2)}px 0;'>
	<Cell />
	<Cell />
	<Cell />
	<Cell />
	<Cell />
</div>

<style>
	.tray {
		grid-area: 1/1;
		place-self: center;
		display: grid;
		grid-auto-flow: column;
	}
</style>
