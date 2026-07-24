<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CollapsibleProps {
		open?: boolean;
		title?: string;
		disabled?: boolean;
		class?: string;
		trigger?: Snippet<[boolean]>;
		children?: Snippet;
		ontoggle?: (open: boolean) => void;
	}

	let {
		open = $bindable(false),
		title = 'Details',
		disabled = false,
		class: className = '',
		trigger,
		children,
		ontoggle
	}: CollapsibleProps = $props();

	function toggle() {
		if (disabled) return;
		open = !open;
		ontoggle?.(open);
	}
</script>

<div class={['w-full', className]}>
	{#if trigger}
		<button type="button" class="w-full text-left" {disabled} aria-expanded={open} onclick={toggle}>
			{@render trigger(open)}
		</button>
	{:else}
		<button
			type="button"
			class={[
				'flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-left text-sm font-medium text-primary transition-colors',
				'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
				disabled && 'cursor-not-allowed opacity-50'
			]}
			{disabled}
			aria-expanded={open}
			onclick={toggle}
		>
			<span>{title}</span>
			<svg
				class={['h-4 w-4 shrink-0 text-muted transition-transform duration-200', open && 'rotate-180']}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
	{/if}

	{#if open}
		<div class="mt-2 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-secondary">
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</div>
