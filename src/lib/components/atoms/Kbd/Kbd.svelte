<script lang="ts">
	import type { Snippet } from 'svelte';

	interface KbdProps {
		keys?: string[];
		size?: 'sm' | 'md';
		class?: string;
		children?: Snippet;
	}

	let {
		keys = [],
		size = 'md',
		class: className = '',
		children
	}: KbdProps = $props();
</script>

{#if children}
	<kbd
		class={[
			'inline-flex items-center rounded-md border border-border bg-surface-overlay font-mono text-secondary shadow-[0_1px_0_0_var(--color-border)]',
			size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
			className
		]}
	>
		{@render children()}
	</kbd>
{:else}
	<span class={['inline-flex items-center gap-1', className]}>
		{#each keys as key, i (i)}
			{#if i > 0}
				<span class="text-muted text-xs">+</span>
			{/if}
			<kbd
				class={[
					'inline-flex items-center rounded-md border border-border bg-surface-overlay font-mono text-secondary shadow-[0_1px_0_0_var(--color-border)]',
					size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
				]}
			>
				{key}
			</kbd>
		{/each}
	</span>
{/if}
