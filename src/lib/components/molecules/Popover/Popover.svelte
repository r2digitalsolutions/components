<script lang="ts">
	import type { Snippet } from 'svelte';

	interface PopoverProps {
		open?: boolean;
		placement?: 'top' | 'bottom' | 'left' | 'right';
		class?: string;
		trigger?: Snippet;
		children?: Snippet;
		onopenchange?: (open: boolean) => void;
	}

	let {
		open = $bindable(false),
		placement = 'bottom',
		class: className = '',
		trigger,
		children,
		onopenchange
	}: PopoverProps = $props();

	let rootEl = $state<HTMLDivElement | null>(null);

	function setOpen(next: boolean) {
		open = next;
		onopenchange?.(next);
	}

	function onDocClick(e: MouseEvent) {
		if (!open || !rootEl) return;
		if (!rootEl.contains(e.target as Node)) setOpen(false);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) setOpen(false);
	}

	const panelPos = {
		top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
		bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
		left: 'right-full top-1/2 mr-2 -translate-y-1/2',
		right: 'left-full top-1/2 ml-2 -translate-y-1/2'
	};
</script>

<svelte:document onclick={onDocClick} onkeydown={onKey} />

<div class={['relative inline-flex', className]} bind:this={rootEl}>
	{#if trigger}{@render trigger()}{/if}

	{#if open}
		<div
			role="dialog"
			class={[
				'absolute z-50 min-w-48 rounded-xl border border-border bg-surface-elevated p-3 shadow-lg',
				panelPos[placement]
			]}
		>
			{#if children}{@render children()}{/if}
		</div>
	{/if}
</div>
