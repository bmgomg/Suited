<script>
	import Cell from './Cell.svelte';

</script>

<div class="tray">
	<Cell />
	<Cell />
	<Cell />
	<Cell />
	<Cell />
</div>

<style>
	.tray {
		grid-area: 1/1;
		display: grid;
		grid-auto-flow: column;
        place-content: center;
	}
</style>
