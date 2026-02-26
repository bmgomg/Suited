<script>
	import Cell from './Cell.svelte';
	import { ss } from './state.svelte';
	import { _range } from './utils';
</script>

<div class="table">
	{#each _range(1, ss.cellCount) as index (index)}
		<Cell cell={ss.cells[index - 1]} />
	{/each}
</div>

<style>
	.table {
		grid-area: 2/1;
		display: grid;
		place-content: center;
	}
</style>
