<script>
	import { CELL_MARGIN, CELL_WIDTH } from './const';
	import HQ from '$lib/images/HQ.webp';
</script>

<div class="cell" style="width: {CELL_WIDTH}px; margin: {CELL_MARGIN}px;">
	<div class="spot"></div>
    <!-- <div class='card'>
		<img src={HQ} alt="" width="100%" />
    </div> -->
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
		border-radius: 8px;
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
