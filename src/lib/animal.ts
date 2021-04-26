import { randomColor, randomAnimalName, randomPointPixels, randomInt } from '$lib/generation';
import type { Point } from './types';

const usedNames: Record<string, boolean> = {};

export class Animal {
	name: string;
	version: number = 0;
	timestamp: number;
	size: number;
	color: string;
	position: Point;

	constructor() {
		let name = randomAnimalName();
		while (usedNames[name]) {
			name = randomAnimalName();
		}
		usedNames[name] = true;
		this.name = name;
		this.position = randomPointPixels();
		this.update(0);
	}

	update(timestamp: number): this {
		this.size = randomInt(10, 15);
		this.color = randomColor();
		this.position = randomPointPixels(this.position);
		this.timestamp = timestamp;
		++this.version;
		return this;
	}
}
