<script>
	import { ss } from './state.svelte';
	import Toolbar from './Toolbar.svelte';

	const hidden = $derived(ss.home);
</script>

<div class="game-page {hidden ? 'hidden' : ''}">
	<!-- <Stats />
	<Scoreboard />
	<LevelPrompt/>
	<PracticeOps/>
	<Board />
	<GameOver />
	<StatusPanel />
	<Timer secs={secsRemained()} />
	<Ranks/>
	<Prompt/> -->
	<Toolbar />
</div>

<style>
	.game-page {
		grid-area: 1/1;
		display: grid;
		grid: 70px 120px 660px 50px / auto;
		/* gap: 10px; */
		width: 100%;
		transition: opacity 0.2s;
		box-sizing: border-box;
		/* padding: 10px 0; */
		user-select: none;
	}

	.hidden {
		opacity: 0;
		pointer-events: none;
	}
</style>
