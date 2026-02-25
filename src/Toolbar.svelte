<script>
	import Home from '$lib/images/Home.webp';
	import MusicOff from '$lib/images/Music Off.webp';
	import MusicOn from '$lib/images/Music On.webp';
	import Pause from '$lib/images/Pause.webp';
	import Stats from '$lib/images/Reset Stats.webp';
	import SoundOff from '$lib/images/Sound Off.webp';
	import SoundOn from '$lib/images/Sound On.webp';
	import { MODE_CHALLENGE, PROMPT_RESET_STATS } from './const';
	import { onMode, persist, showIntro, stopTimer } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import { _prompt, _stats, ss } from './state.svelte';
	import ToolButton from './Tool Button.svelte';

	const onHome = () => {
		showIntro(true);
	};

	const onPause = () => {
		stopTimer();
		onMode(MODE_CHALLENGE);
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
</script>

<div class="toolbar">
	<ToolButton id="tb-home" src={Home} onClick={onHome} />
	{#if !ss.practice}
		<ToolButton id="tb-pause" src={Pause} onClick={onPause} disabled={!ss.timer} />
		<ToolButton id="tb-stats" src={Stats} onClick={onResetStats} disabled={_stats.plays === 0 || ss.timer} />
	{/if}
	<ToolButton id="tb-sfx" src={_sound.sfx ? SoundOn : SoundOff} onClick={onSound} />
	<ToolButton id="tb-music" src={_sound.music ? MusicOn : MusicOff} onClick={onMusic} />
</div>

<style>
	.toolbar {
		grid-area: 4/1;
		display: grid;
		grid-auto-flow: column;
		place-content: center;
		align-items: center;
		gap: 15px;
	}
</style>
