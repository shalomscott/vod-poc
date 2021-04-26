import { DBSchema, deleteDB, IDBPTransaction, openDB } from 'idb';
import { Animal } from './animal';
import { generateTimestamps, randomInt } from './generation';
import { TimeSpan, PushableStore } from './types';

interface AnimalDB extends DBSchema {
	updates: {
		value: Animal;
		key: [string, number];
		indexes: { timestamp: number };
	};
}

export class AnimalEngine {
	private dbPromise = globalThis.indexedDB
		? deleteDB('animals').then(() =>
				openDB<AnimalDB>('animals', 1, {
					upgrade(db) {
						const peopleStore = db.createObjectStore('updates', {
							keyPath: ['name', 'version']
						});
						peopleStore.createIndex('timestamp', 'timestamp');
					}
				})
		  )
		: null;

	private lastTimestamp = 0;

	private _animals = new PushableStore<Record<string, PushableStore<Animal>>>({});

	animals = this._animals.asReadable();

	constructor() {}

	async generateAnimals(
		{ start, end }: TimeSpan,
		animalsToCreate: number,
		updatesPerSecond: number
	): Promise<void> {
		const timestamps = generateTimestamps(start, end, updatesPerSecond);

		const db = await this.dbPromise;
		const txn = db.transaction('updates', 'readwrite');

		const animals: Animal[] = [];
		for (let i = 0; i < animalsToCreate; ++i) {
			const animal = new Animal();
			txn.store.add(animal);
			animals.push(animal);
		}

		for (let timestamp of timestamps) {
			const animal = animals[randomInt(0, animals.length - 1)].update(timestamp);
			txn.store.add(animal);
		}

		await txn.done;

		this.lastTimestamp = 0; // reset
	}

	async updateAnimals(toTimestamp: number): Promise<void> {
		if (toTimestamp === this.lastTimestamp) {
			return;
		}
		const db = await this.dbPromise;
		const txn = db.transaction('updates', 'readonly');
		const timestampIndex = txn.store.index('timestamp');
		const [lower, upper] = [this.lastTimestamp, toTimestamp].sort();

		const keys = await timestampIndex.getAllKeys(IDBKeyRange.bound(lower, upper));

		const updatesToRead =
			toTimestamp >= this.lastTimestamp
				? this.consolidateUpdatesAscending(keys)
				: this.consolidateUpdatesDescending(keys);

		const animalUpdates = await this.readUpdates(txn, updatesToRead);

		let animalsChanged = false;
		for (let update of animalUpdates) {
			if (!this._animals.current[update.name]) {
				this._animals.current[update.name] = new PushableStore(update);
				animalsChanged = true;
			} else {
				this._animals.current[update.name].push(update);
			}
		}

		if (animalsChanged) {
			this._animals.push();
		}

		this.lastTimestamp = toTimestamp;
	}

	private readUpdates(
		txn: IDBPTransaction<AnimalDB, ['updates'], 'readonly'>,
		versions: Record<string, number>
	) {
		const reads: Promise<Animal>[] = [];
		for (const name in versions) {
			reads.push(txn.store.get([name, versions[name]]));
		}
		return Promise.all(reads);
	}

	private consolidateUpdatesAscending(keys: AnimalDB['updates']['key'][]): Record<string, number> {
		return keys.reduceRight((updatedVersions, [name, version]) => {
			if (!(name in updatedVersions)) {
				updatedVersions[name] = version;
			}
			return updatedVersions;
		}, {});
	}

	private consolidateUpdatesDescending(keys: AnimalDB['updates']['key'][]): Record<string, number> {
		return keys.reduce((updatedVersions, [name, version]) => {
			if (!(name in updatedVersions)) {
				updatedVersions[name] = version - 1;
			}
			return updatedVersions;
		}, {});
	}
}
