import type { Readable, Subscriber, Unsubscriber } from 'svelte/store';

export type PlayState = 'play' | 'pause' | 'reverse' | 'fast-forward' | 'fast-reverse';

export type Point = {
	x: number;
	y: number;
};

export type TimeSpan = {
	start: number;
	end: number;
};

export class PushableStore<T> implements Readable<T> {
	current: T;

	private subscribers: Subscriber<T>[] = [];

	constructor(initial: T) {
		this.current = initial;
	}

	subscribe(subscriber: Subscriber<T>): Unsubscriber {
		const index = this.subscribers.push(subscriber) - 1;
		subscriber(this.current);
		return () => {
			this.subscribers.splice(index, 1);
		};
	}

	push(value: T = this.current): void {
		for (let subscriber of this.subscribers) {
			subscriber(value);
		}
	}

	asReadable(): Readable<T> {
		return {
			subscribe: this.subscribe.bind(this)
		};
	}
}
