import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import type { Point } from './types';

export function getAnimalName(): string {
	return uniqueNamesGenerator({
		dictionaries: [adjectives, colors, animals],
		separator: '-'
	});
}

export function randomColor(): string {
	return Math.floor(Math.random() * 16777215).toString(16);
}

export function randomSign(): number {
	return Math.random() > 0.5 ? 1 : -1;
}

const docHeightRadius = (globalThis.innerHeight ?? 0) / 2;
const docWidthRadius = (globalThis.innerWidth ?? 0) / 2;

function keepInBounds(start: number, offset, bound: number) {
	if (Math.abs(start + offset) > bound) {
		return start - offset;
	}
	return start + offset;
}

export function randomPointPixels(start?: Point): Point {
	if (start) {
		return {
			x: keepInBounds(start.x, Math.floor(Math.random() * 10) * randomSign(), docWidthRadius),
			y: keepInBounds(start.y, Math.floor(Math.random() * 10) * randomSign(), docHeightRadius)
		};
	}
	return {
		x: randomInt(0, docWidthRadius) * randomSign(),
		y: randomInt(0, docHeightRadius) * randomSign()
	};
}

export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @param start milliseconds
 * @param end milliseconds
 * @param freqPerSec per second frequency
 */
export function generateTimestamps(start: number, end: number, freqPerSec: number): number[] {
	const timestamps: number[] = [];
	const amountToGenerate = Math.floor(((end - start) / 1000) * freqPerSec);

	for (let i = 0; i < amountToGenerate; ++i) {
		timestamps.push(randomInt(start, end));
	}

	return timestamps.sort();
}
