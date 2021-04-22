import { writable } from 'svelte/store';
import type { Animal } from './animal';

export const time = writable(0);

export const animals = writable<Animal[]>([]);
