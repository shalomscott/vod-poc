<script>
	import { openDB, deleteDB } from 'idb';
	import { Animal } from '$lib/animal';
	import { generateTimestamps, randomInt } from '$lib/generation';
	import { animalsToCreate, updatesPerSecond } from '../settings.json';
	import type { TimeSpan } from '$lib/types';

	export let timespan: TimeSpan;

	let generationPromise: Promise<number> = null;

	const dbPromise = deleteDB('animals').then(() =>
		openDB('animals', 1, {
			upgrade(db) {
				const peopleStore = db.createObjectStore('updates', {
					keyPath: ['name', 'version']
				});
				peopleStore.createIndex('timestamp', 'timestamp');
			}
		})
	);

	async function generate(): Promise<number> {
		const timerStart = Date.now();
		const timestamps = generateTimestamps(timespan.start, timespan.end, updatesPerSecond);

		const db = await dbPromise;
		const txn = db.transaction('updates', 'readwrite');
		const writes = [];

		const animals: Animal[] = [];
		for (let i = 0; i < animalsToCreate; ++i) {
			const animal = new Animal();
			writes.push(txn.store.put(animal));
			animals.push(animal);
		}

		for (let timestamp of timestamps) {
			const animal = animals[randomInt(0, animals.length - 1)].update(timestamp);
			writes.push(txn.store.put(animal));
		}

		await Promise.all([...writes, txn.done]);
		return Date.now() - timerStart;
	}
</script>

{#if generationPromise}
	<p>
		{#await generationPromise}
			Generating...
		{:then time}
			Generation took: {time}ms
		{/await}
	</p>
{:else}
	<button on:click={() => (generationPromise = generate())}>Generate</button>
{/if}
