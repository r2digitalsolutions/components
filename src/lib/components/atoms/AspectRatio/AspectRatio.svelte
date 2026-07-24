<script lang="ts">
	import type { Snippet } from 'svelte';

	interface AspectRatioProps {
		/** e.g. 1.777 for 16:9, 1 for square */
		ratio?: number;
		class?: string;
		children?: Snippet;
	}

	let { ratio = 1.777777778, class: className = '', children }: AspectRatioProps = $props();
</script>

<div class={['relative w-full overflow-hidden', className]} style:aspect-ratio={ratio}>
	<div class="absolute inset-0">
		{#if children}{@render children()}{/if}
	</div>
</div>
