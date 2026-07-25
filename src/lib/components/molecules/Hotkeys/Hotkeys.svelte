<script lang="ts">
	import Kbd from '$lib/components/atoms/Kbd/Kbd.svelte';

	export interface HotkeyItem {
		keys: string[];
		description: string;
	}

	interface HotkeysProps {
		items?: HotkeyItem[];
		title?: string;
		columns?: 1 | 2;
		class?: string;
	}

	let {
		items = [],
		title = 'Keyboard shortcuts',
		columns = 1,
		class: className = ''
	}: HotkeysProps = $props();
</script>

<section
	class={[
		'w-full overflow-hidden rounded-xl border border-border bg-surface-elevated',
		className
	]}
	aria-label={title}
>
	{#if title}
		<header class="border-b border-border px-4 py-3 text-sm font-semibold text-primary">
			{title}
		</header>
	{/if}
	<ul
		class={[
			'grid gap-px bg-border',
			columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'
		]}
	>
		{#each items as item, i (i)}
			<li class="flex items-center justify-between gap-4 bg-surface-elevated px-4 py-2.5">
				<span class="text-sm text-secondary">{item.description}</span>
				<span class="inline-flex shrink-0 items-center gap-1">
					{#each item.keys as key, ki (ki)}
						{#if ki > 0}
							<span class="text-xs text-muted">+</span>
						{/if}
						<Kbd>{key}</Kbd>
					{/each}
				</span>
			</li>
		{/each}
	</ul>
</section>
