<script>
	import { time } from '$lib/stores';
	import type { PlayState, TimeSpan } from '$lib/types';

	export let timespan: TimeSpan;

	let state: PlayState = 'pause';
	let playingInterval = null;

	function playback(newState: PlayState) {
		return () => {
			state = newState;
			if (playingInterval || state === 'pause') {
				return;
			}
			let last = Date.now();
			playingInterval = setInterval(() => {
				if (state !== 'pause') {
					const now = Date.now();
					const moveTo = $time + advance(last, now);
					if (moveTo < timespan.start || moveTo > timespan.end) {
						state = 'pause';
					} else {
						$time = moveTo;
						last = now;
					}
				} else {
					clearInterval(playingInterval);
					playingInterval = null;
				}
			});
		};
	}

	function advance(last: number, now: number) {
		switch (state) {
			case 'reverse':
				return last - now;
			case 'play':
				return now - last;
			case 'fast-forward':
				return (now - last) * 20;
			case 'fast-reverse':
				return (last - now) * 20;
		}
	}

	function formatTime(time: number): string {
		return new Date(time).toTimeString();
	}
</script>

<div class="player">
	<label for="player-range">
		{formatTime($time)}
	</label>
	<input
		id="player-range"
		type="range"
		min={timespan.start}
		max={timespan.end}
		bind:value={$time}
	/>
	<div class="controls">
		<button class:active={state === 'fast-reverse'} on:click={playback('fast-reverse')}
			>◀◀ Fast-Reverse</button
		>
		<button class:active={state === 'reverse'} on:click={playback('reverse')}>◀ Reverse</button>
		<button class:active={state === 'pause'} on:click={playback('pause')}>Pause</button>
		<button class:active={state === 'play'} on:click={playback('play')}>Play ▶</button>
		<button class:active={state === 'fast-forward'} on:click={playback('fast-forward')}
			>▶▶ Fast</button
		>
	</div>
	<div class="additional">
		<slot />
	</div>
</div>

<style>
	.player {
		padding: 1rem;
		border: 2px solid black;
		border-radius: 2rem;
		margin: auto 0 1rem;
		background-color: white;
	}
	.player > *:not(:last-child) {
		margin-bottom: 1rem;
	}
	label {
		display: block;
		text-align: center;
	}
	#player-range {
		display: block;
		width: 100%;
	}
	.controls {
		display: flex;
		justify-content: space-around;
	}
	.additional {
		text-align: center;
	}
	button.active {
		background-color: goldenrod;
	}
</style>
