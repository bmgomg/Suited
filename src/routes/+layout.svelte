<script>
	import favicon from '$lib/images/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global {
		body {
			margin: 0;
			padding: 0;
			height: 100dvh;
			width: 100%;
			--ow: #f9f9f7;
			--water: #2c3a49;
            --aqua: #adffe4;
            --gold: #ffe4aa;
            --red: #ff0000;
            --background: #202020;
			background: var(--background);
			color: var(--ow);
			background-image: url('$lib/images/Texture.webp');
			background-size: 350px;
			font-family: Playfair;
		}

		.button-base {
			box-sizing: border-box;
			display: grid;
			place-content: center;
			transition: transform 0.1s;
			cursor: pointer;
		}

		.button-base:focus {
			outline: none !important;
		}

		.no-highlight {
			-webkit-tap-highlight-color: transparent;
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}

		@font-face {
			font-family: Cinzel;
			src: url('$lib/fonts/Cinzel.ttf');
		}

		@font-face {
			font-family: Playfair;
			src: url('$lib/fonts/Playfair Display.ttf');
		}
	}
</style>
