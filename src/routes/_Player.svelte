<script>
	import { time } from '$lib/stores';
	import type { TimeSpan } from '$lib/types';

	export let timespan: TimeSpan;

	let state: 'play' | 'pause' | 'reverse' = 'pause';
	$: if (state !== 'pause') {
		startPlaying();
	}

	function startPlaying() {
		let last = Date.now();
		const intervalId = setInterval(() => {
			if (state !== 'pause') {
				const now = Date.now();
				$time += state === 'play' ? now - last : last - now;
				last = now;
			} else {
				clearInterval(intervalId);
			}
		});
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
		<button on:click={() => (state = 'reverse')}>◀ Reverse</button>
		<button on:click={() => (state = 'pause')}>Pause</button>
		<button on:click={() => (state = 'play')}>Play ▶</button>
	</div>
</div>

<style>
	.player {
		padding: 1rem;
		border: 2px dashed goldenrod;
		border-radius: 2rem;
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
</style>
