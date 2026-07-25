<script lang="ts">
	import type { Snippet } from 'svelte';

	interface EyebrowProps {
		class?: string;
		children?: Snippet;
	}

	const { class: className = '', children }: EyebrowProps = $props();
</script>

<p
	class={[
		'text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400',
		className
	]}
>
	{#if children}{@render children()}{/if}
</p>
