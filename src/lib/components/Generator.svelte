<script>
	import { createEventDispatcher } from 'svelte';
	import type { TimeSpan } from '$lib/types';
	import type { AnimalEngine } from '$lib/animal-engine';
	import { animalsToCreate, updatesPerSecond } from '../../settings.json';

	export let timespan: TimeSpan;
	export let animalEngine: AnimalEngine;

	const dispatch = createEventDispatcher();

	let start = false;

	async function generate(): Promise<number> {
		const timerStart = Date.now();
		await animalEngine.generateAnimals(timespan, animalsToCreate, updatesPerSecond);
		const elapsed = Date.now() - timerStart;
		dispatch('generated');
		return elapsed;
	}
</script>

<div class="generate-button">
	{#if start}
		<span>
			{#await generate()}
				Generating...
			{:then time}
				Generation took: {time}ms
			{/await}
		</span>
	{:else}
		<button on:click={() => (start = true)}>Generate</button>
	{/if}
</div>
