<script>
	import Cell from './Cell.svelte';
</script>

<div class="table">
	<div class="row"><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /></div>
	<div class="row"><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /></div>
	<div class="row"><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /></div>
	<div class="row"><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /></div>
	<div class="row"><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /></div>
	<div class="row"><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /><Cell /></div>
</div>

<style>
	.table {
		grid-area: 3/1;
		display: grid;
		place-content: center;
	}

	.row {
		display: grid;
		grid-auto-flow: column;
	}
</style>
