<script>
	import Check from '$lib/images/Check.webp';
	import Deck from '$lib/images/Deck.webp';
	import Home from '$lib/images/Home.webp';
	import MusicOff from '$lib/images/Music Off.webp';
	import MusicOn from '$lib/images/Music On.webp';
	import Stats from '$lib/images/Reset Stats.webp';
	import Restart from '$lib/images/Restart.webp';
	import SoundOff from '$lib/images/Sound Off.webp';
	import SoundOn from '$lib/images/Sound On.webp';
	import { PROMPT_RESET_STATS } from './const';
	import { deckCodes, makePuzzle, persist, refillTray, showIntro } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { _prompt, _stats, ss } from './state.svelte';
	import ToolButton from './Tool Button.svelte';

	const onHome = () => {
		showIntro(true);
	};

	const onRestart = () => {
		makePuzzle();
	};

	const onDeck = () => {
		_sound.play('plop');
	};

	const onCheck = () => {
		_sound.play('plop');
		refillTray();
	};

	const onResetStats = () => {
		if (_prompt.id == PROMPT_RESET_STATS) {
			_prompt.opacity = 0;
			return;
		}

		_sound.play('plop');
		_prompt.set(PROMPT_RESET_STATS);
	};

	const onSound = () => {
		_sound.sfx = !_sound.sfx;

		if (_sound.sfx) {
			_sound.play('won', { rate: 4 });
		}

		persist();
	};

	const onMusic = () => {
		_sound.music = !_sound.music;

		if (_sound.music) {
			_sound.playMusic();
		} else {
			_sound.stopMusic();
		}

		persist();
	};

	const count = $derived(deckCodes().length);
</script>

<div class="toolbar">
	<ToolButton id="tb-home" src={Home} onClick={onHome} />
	<ToolButton id="tb-restart" src={Restart} onClick={onRestart} />
	<div class="deck">
		<div style="grid-area: 1/1;"><ToolButton id="tb-deck" src={Deck} onClick={onDeck} /></div>
		<div class='deck-counter'>{count}</div>
	</div>
	<ToolButton id="tb-check" src={Check} onClick={onCheck} />
	<ToolButton id="tb-stats" src={Stats} onClick={onResetStats} disabled={_stats.plays === 0 || ss.timer} />
	<ToolButton id="tb-sfx" src={_sound.sfx ? SoundOn : SoundOff} onClick={onSound} />
	<ToolButton id="tb-music" src={_sound.music ? MusicOn : MusicOff} onClick={onMusic} />
</div>

<style>
	.toolbar {
		grid-area: 3/1;
		display: grid;
		grid-auto-flow: column;
		place-content: center;
		align-items: center;
		gap: 25px;
	}

	.deck {
		display: grid;
	}

	.deck-counter {
		grid-area: 1/1;
		place-self: center;
		margin-left: 8px;
		font-family: RC;
		font-size: 13px;
		color: var(--water);
		z-index: 1;
		display: grid;
		place-content: center;
	}
</style>
