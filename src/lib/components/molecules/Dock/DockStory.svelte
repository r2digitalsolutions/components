<script lang="ts">
	import Dock from './Dock.svelte';
	import DockItem from './DockItem.svelte';
	import type { DockSize } from './Dock.svelte';

	let { size = 'sm' }: { size?: DockSize } = $props();

	let value = $state('es');
	const langs = ['es', 'en', 'ca', 'fr', 'de'];
	const filled = new Set(['es', 'en']);
</script>

<div class="gap-4 flex flex-col">
	<Dock {size}>
		{#each langs as lang (lang)}
			<DockItem {size} active={value === lang} onclick={() => (value = lang)}>
				{lang.toUpperCase()}
				{#if filled.has(lang)}
					<span class="h-1.5 w-1.5 bg-emerald-500 rounded-full" aria-hidden="true"></span>
				{/if}
			</DockItem>
		{/each}
	</Dock>
	<p class="text-xs text-muted">Selected: {value.toUpperCase()}</p>
</div>
