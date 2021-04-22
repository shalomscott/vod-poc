import { randomColor, getAnimalName, randomPointPixels, randomInt } from '$lib/generation';
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
		let name = getAnimalName();
		while (usedNames[name]) {
			name = getAnimalName();
		}
		usedNames[name] = true;
		this.name = name;
		this.position = randomPointPixels();
		this.update(0);
	}

	update(timestamp: number): this {
		this.size = randomInt(1, 50);
		this.color = randomColor();
		this.position = randomPointPixels(this.position);
		this.timestamp = timestamp;
		++this.version;
		return this;
	}
}
