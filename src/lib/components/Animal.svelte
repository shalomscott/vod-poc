<script>
	import type { Readable } from 'svelte/store';
	import type { Animal } from '$lib/animal';

	export let animal: Readable<Animal>;
</script>

<span
	class="animal"
	style="--color: #{$animal.color}; --size: {$animal.size}px; --x-offset: {$animal.position
		.x}px; --y-offset: {$animal.position.y}px"
>
	{$animal.name}
</span>

<style>
	.animal {
		display: block;
		position: absolute;
		top: calc(50vh + var(--y-offset));
		left: calc(50vw + var(--x-offset));
		font-size: var(--size);
		color: var(--color);
		z-index: -1000;
	}
</style>
