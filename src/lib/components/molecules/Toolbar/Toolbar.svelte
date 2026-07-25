<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ToolbarProps {
		label?: string;
		dense?: boolean;
		sticky?: boolean;
		class?: string;
		start?: Snippet;
		center?: Snippet;
		end?: Snippet;
		children?: Snippet;
	}

	let {
		label = 'Toolbar',
		dense = false,
		sticky = false,
		class: className = '',
		start,
		center,
		end,
		children
	}: ToolbarProps = $props();
</script>

<div
	role="toolbar"
	aria-label={label}
	class={[
		'flex w-full items-center gap-2 border border-border bg-surface-elevated',
		dense ? 'rounded-lg px-2 py-1.5' : 'rounded-xl px-3 py-2',
		sticky && 'sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-surface-elevated/90',
		className
	]}
>
	{#if start || center || end}
		<div class="flex min-w-0 flex-1 items-center gap-1.5">
			{#if start}{@render start()}{/if}
		</div>
		{#if center}
			<div class="flex shrink-0 items-center gap-1.5">
				{@render center()}
			</div>
		{/if}
		<div class="flex min-w-0 flex-1 items-center justify-end gap-1.5">
			{#if end}{@render end()}{/if}
		</div>
	{:else if children}
		{@render children()}
	{/if}
</div>
