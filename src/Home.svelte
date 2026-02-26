<script>
	import { fade } from 'svelte/transition';
	import { MODE_SELF, MODE_PRACITCE } from './const';
	import { onMode } from './shared.svelte';
	import { ss } from './state.svelte';
	import TextButton from './Text Button.svelte';

	const ul = '<ul style="margin-top: 5px;">';
	const hi = '<span style="color: var(--gold);">';
	const p = '<span style="margin-top: -5px; color:">';

	const CONTENT = `
		<span style="margin-bottom: 25px;">Place cards so every adjacent pair is valid.</span>
		${p}Valid pair:</span>
		${ul}
		<li>Cards share the ${hi}same suit</span>, or</li>
		<li>Cards share the ${hi}same rank</span>.</li>
		</ul>
		${p}Moves:</span>
		${ul}
		<li>Place cards from the tray onto empty table spaces.</li>
		<li>You may also ${hi}reposition</span> table cards if you create ${hi}at least as many</span> pairs as you break.</li>
		</ul>
		${p}Scoring:</span>
		${ul}
		<li>+1 point per pair formed.</li>
		<li>–1 point per pair broken.</li>
		</ul>
		${p}Rules:</span>
		${ul}
		<li>All cards on the table must stay in one ${hi}connected</span> group.</li>
		<li>Tap a card to select it, then tap an empty space to move it.</li>
		<li>Tap the ${hi}check button</span> to end or skip your turn.</li>
		<li>Unused tray cards are ${hi}recycled</span>, and the tray is refilled from the deck.</li>
		</ul>
		${p}Game ends when ${hi}no more</span> cards can be drawn or the ${hi}maximum</span> number of pairs is reached.</span>
	`;
</script>

{#if ss.home}
	<div class="home" in:fade={{ duration: 200 }}>
		<div class="title grad-text">Suited</div>
		<div class="content" tabindex="-1">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html CONTENT}
		</div>
		<div class="buttons">
			<TextButton id={'tb-mode-' + MODE_SELF} text={['play']} onClick={() => onMode(MODE_SELF)} />
		</div>
	</div>
{/if}

<style>
	.home {
		place-self: center;
		grid-area: 1/1;
		display: grid;
		justify-items: center;
		user-select: none;
		font-size: 18px;
	}

	.title {
		font-size: 52px;
		font-family: Cinzel;
		font-weight: bold;
		filter: drop-shadow(0 0px 2px black);
	}

	.grad-text {
		/* background: -webkit-linear-gradient(-90deg, var(--ow) 0%, var(--ow) 30%, var(--gold) 60%, var(--gold) 100%); */
		background: -webkit-linear-gradient(-90deg, #ede2c5, #b6a678 50%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: none;
		background-size: cover;
		background-position: center;
	}

	.content {
		display: grid;
		align-content: start;
		width: 580px;
		margin: 50px 0 60px;
		font-family: Poppins;
		filter: drop-shadow(0 0px 2px black);
	}

	.buttons {
		display: grid;
		grid-auto-flow: column;
		gap: 32px;
		font-family: Cinzel;
		font-size: 32px;
		font-weight: bold;
		color: var(--gold);
		filter: drop-shadow(0 0px 2px black);
	}
</style>
