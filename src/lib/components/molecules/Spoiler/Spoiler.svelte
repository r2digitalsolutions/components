<script lang="ts">
	import type { Snippet } from 'svelte';

	interface SpoilerProps {
		label?: string;
		revealLabel?: string;
		open?: boolean;
		class?: string;
		children?: Snippet;
		ontoggle?: (open: boolean) => void;
	}

	let {
		label = 'Spoiler',
		revealLabel = 'Click to reveal',
		open = $bindable(false),
		class: className = '',
		children,
		ontoggle
	}: SpoilerProps = $props();

	function toggle() {
		open = !open;
		ontoggle?.(open);
	}
</script>

{#if open}
	<div class={['rounded-xl border border-border bg-surface-elevated p-3 text-sm text-secondary', className]}>
		<div class="mb-2 flex items-center justify-between gap-2">
			<span class="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
			<button
				type="button"
				class="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
				onclick={toggle}
			>
				Hide
			</button>
		</div>
		{@render children?.()}
	</div>
{:else}
	<button
		type="button"
		class={[
			'inline-flex items-center gap-2 rounded-xl border border-dashed border-border bg-surface-overlay px-3 py-2 text-sm text-muted transition-colors',
			'hover:border-border-strong hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
			className
		]}
		aria-expanded="false"
		onclick={toggle}
	>
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
			/>
		</svg>
		{revealLabel}
	</button>
{/if}
