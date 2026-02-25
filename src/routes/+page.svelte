<script>
	import GamePage from '../Game Page.svelte';
	import Home from '../Home.svelte';
	import Splash from '../Splash.svelte';
	import { ss } from '../state.svelte';
	import { clientRect, post } from '../utils';

	let scale = $state(1);

	$effect(() => {
		const disable = (e) => {
			e.preventDefault();
		};

		const onResize = () => {
			let scx = 1;
			let scy = 1;

			const r = clientRect('.app');

			if (r.width < 1000) {
				scx = r.width / 1000;
			}

			if (r.height < 900) {
				scy = r.height / 900;
			}

			scale = Math.min(scx, scy);
		};

		onResize();

		window.addEventListener('contextmenu', disable);
		window.addEventListener('dblclick', disable);
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('contextmenu', disable);
			window.removeEventListener('dblclick', disable);
			window.removeEventListener('resize', onResize);
		};
	});

	let splash = $state(true);
	post(() => (splash = false), 2000);
</script>

<div class="app">
	{#if splash}
		<Splash />
	{:else}
		<div class="content" style="scale: {scale};">
			<GamePage />
			<Home />
			{#if ss.home}
				<div class="disclaimer no-highlight">
					<span>MUSIC BY ERIC MATYAS  •  WWW.SOUNDIMAGE.ORG</span>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.app {
		height: 100dvh;
		display: grid;
		place-content: center;
		box-sizing: border-box;
		background: radial-gradient(transparent, black 200%);
		overflow: hidden;
	}

	.content {
		grid-area: 1/1;
		place-self: center;
		display: grid;
		touch-action: none;
		box-sizing: border-box;
		width: 1000px;
		height: 900px;
		border: 1px dotted #ffffff40;
	}

	.disclaimer {
		display: none;
		grid-area: 1/1;
		place-self: center;
		font-size: 10px;
		transform: translateY(380px);
		justify-items: center;
		gap: 3px;
		opacity: 0.8;
	}
</style>
