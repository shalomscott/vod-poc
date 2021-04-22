<script context="module">
	import type { Load } from '@sveltejs/kit';
	import type { TimeSpan } from '$lib/types';
	import { timelineMinutes } from '../settings.json';

	export const load: Load = () => {
		const start = Date.now();
		const end = start + timelineMinutes * 60 * 1000;
		const timespan: TimeSpan = { start, end };
		return {
			props: {
				timespan
			}
		};
	};
</script>

<script>
	import Generator from './_Generator.svelte';
	import Player from './_Player.svelte';

	export let timespan: TimeSpan;
</script>

<Generator {timespan} />

<Player {timespan} />
