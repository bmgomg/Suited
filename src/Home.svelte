<script>
	import { fade } from 'svelte/transition';
	import { MODE_CHALLENGE, MODE_PRACITCE } from './const';
	import { onMode } from './shared.svelte';
	import { ss } from './state.svelte';
	import TextButton from './Text Button.svelte';

	const hi = '<span style="color: var(--gold);">';

	const CONTENT = `
        <span>Solve each puzzle by swapping ${hi}exactly two</span> cards. You get ${hi}only one swap</span> per task.</span>
		<br/>
        <span>The puzzle is solved when all horizon-tally or verticanpm installlly ${hi}adjacent</span> cards are at least ${hi}two ranks apart</span>. For example, these pairs are invalid: 3–4, 8–8, 10–Jack, or King–Ace.</span>
		 `;
</script>

{#if ss.home}
	<div class="home" in:fade={{ duration: 200 }}>
		<div class="title grad-text">Ace in Place</div>
		<div class="content" tabindex="-1">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html CONTENT}
		</div>
		<div class="buttons">
			{#each [MODE_PRACITCE, MODE_CHALLENGE] as mode (mode)}
				{@const color = mode === MODE_PRACITCE ? 'var(--ow)' : 'var(--gold)'}
				<TextButton id={'tb-mode-' + mode} text={[mode]} style="color: {color}" onClick={() => onMode(mode)} />
			{/each}
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
		font-size: 21px;
	}

	.title {
		font-size: 52px;
		font-family: Cinzel;
		font-weight: bold;
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
		width: 365px;
		margin: 50px 0 60px;
	}

	.buttons {
		display: grid;
		grid-auto-flow: column;
		gap: 32px;
		font-family: Cinzel;
		font-size: 23px;
		font-weight: bold;
		color: var(--gold);
	}
</style>
