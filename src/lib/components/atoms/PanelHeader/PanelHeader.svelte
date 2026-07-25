<script lang="ts">
	import type { Snippet } from 'svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	interface PanelHeaderProps {
		title: string;
		/** Optional secondary line under the title */
		description?: string;
		collapsible?: boolean;
		collapsed?: boolean;
		/**
		 * subtle — soft bar (default, docks)
		 * solid — opaque elevated strip
		 * ghost — no fill, only bottom rule
		 */
		variant?: 'subtle' | 'solid' | 'ghost';
		size?: 'sm' | 'md';
		class?: string;
		icon?: Snippet;
		actions?: Snippet;
		ontoggle?: (collapsed: boolean) => void;
	}

	let {
		title,
		description = '',
		collapsible = false,
		collapsed = $bindable(false),
		variant = 'subtle',
		size = 'sm',
		class: className = '',
		icon,
		actions,
		ontoggle
	}: PanelHeaderProps = $props();

	function toggle() {
		if (!collapsible) return;
		const next = !collapsed;
		collapsed = next;
		ontoggle?.(next);
	}
</script>

{#snippet lead()}
	{#if collapsible}
		<span
			class={[
				'inline-flex shrink-0 items-center justify-center text-muted',
				size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'
			]}
			aria-hidden="true"
		>
			<ChevronRight
				class={['h-3.5 w-3.5 transition-transform duration-200', !collapsed && 'rotate-90']}
				strokeWidth={2.25}
			/>
		</span>
	{/if}

	{#if icon}
		<span
			class={[
				'flex shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600',
				'ring-1 ring-brand-500/10 dark:bg-brand-950/50 dark:text-brand-300',
				size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'
			]}
			aria-hidden="true"
		>
			{@render icon()}
		</span>
	{/if}

	<span class="min-w-0 flex-1 text-left">
		<span
			class={[
				'block truncate font-semibold tracking-tight text-primary',
				size === 'sm' ? 'text-xs leading-4' : 'text-sm leading-5'
			]}
		>
			{title}
		</span>
		{#if description}
			<span class="block truncate text-[10px] leading-tight text-muted">{description}</span>
		{/if}
	</span>
{/snippet}

<div
	class={[
		'flex shrink-0 items-center gap-1 border-b border-border',
		variant === 'subtle' && 'bg-surface-overlay/70',
		variant === 'solid' && 'bg-surface-overlay',
		variant === 'ghost' && 'bg-transparent',
		size === 'sm' && 'min-h-8 px-1.5 py-1',
		size === 'md' && 'min-h-10 px-2 py-1.5',
		className
	]}
>
	{#if collapsible}
		<button
			type="button"
			class="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1 py-0.5 text-left outline-none transition-colors hover:bg-surface-elevated/80 focus-visible:ring-2 focus-visible:ring-brand-500/30"
			aria-expanded={!collapsed}
			aria-label={collapsed ? `Expand ${title}` : `Collapse ${title}`}
			onclick={toggle}
		>
			{@render lead()}
		</button>
	{:else}
		<div class="flex min-w-0 flex-1 items-center gap-1.5 px-1 py-0.5">
			{@render lead()}
		</div>
	{/if}

	{#if actions}
		<div class="flex shrink-0 items-center gap-0.5 pr-0.5">
			{@render actions()}
		</div>
	{/if}
</div>
