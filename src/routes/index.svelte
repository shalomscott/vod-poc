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
	import { time } from '$lib/stores';
	import { AnimalEngine } from '$lib/animal-engine';

	import Player from '$lib/components/Player.svelte';
	import Animal from '$lib/components/Animal.svelte';
	import Generator from '$lib/components/Generator.svelte';

	export let timespan: TimeSpan;
	$time = timespan.start;

	const animalEngine = new AnimalEngine();
	const animals = animalEngine.animals;

	function mainLoop() {
		requestAnimationFrame(async () => {
			await animalEngine.updateAnimals($time);
			mainLoop();
		});
	}
</script>

{#each Object.entries($animals) as [name, animal] (name)}
	<Animal {animal} />
{/each}

<Player {timespan}>
	<Generator {animalEngine} {timespan} on:generated={mainLoop} />
</Player>
