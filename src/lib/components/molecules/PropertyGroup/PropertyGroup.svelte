<script lang="ts">
	import type { Snippet } from 'svelte';

	interface PropertyGroupProps {
		title: string;
		open?: boolean;
		class?: string;
		children?: Snippet;
		ontoggle?: (open: boolean) => void;
	}

	let {
		title,
		open = $bindable(true),
		class: className = '',
		children,
		ontoggle
	}: PropertyGroupProps = $props();

	function toggle() {
		open = !open;
		ontoggle?.(open);
	}
</script>

<section class={['border-b border-border last:border-b-0', className]}>
	<button
		type="button"
		class="flex w-full items-center gap-1.5 bg-surface-overlay/40 px-2 py-1.5 text-left hover:bg-surface-overlay"
		aria-expanded={open}
		onclick={toggle}
	>
		<svg
			class={['size-3 shrink-0 text-secondary transition-transform', open && 'rotate-90']}
			viewBox="0 0 12 12"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M4.5 2.5L8.5 6L4.5 9.5V2.5Z" />
		</svg>
		<span class="truncate text-[11px] font-semibold uppercase tracking-wide text-secondary">
			{title}
		</span>
	</button>

	{#if open}
		<div class="space-y-0.5 px-1 py-1 min-w-0 overflow-x-hidden">
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</section>
