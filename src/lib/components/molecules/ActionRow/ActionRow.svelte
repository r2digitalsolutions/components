<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	export type ActionRowIcon = Component<{
		class?: string;
		size?: number | string;
		strokeWidth?: number | string;
	}>;

	export type ActionRowTone = 'brand' | 'info' | 'warning' | 'danger' | 'neutral';

	interface ActionRowProps {
		title: string;
		/** Small text next to the title (time ago, stars…). */
		meta?: string;
		/** Second line, truncated to one line. */
		description?: string;
		icon?: ActionRowIcon;
		/** Colour of the icon tile: what kind of item this is. */
		tone?: ActionRowTone;
		/** Makes the title area a link (the actions stay independent). */
		href?: string;
		/** Mark as unread / new. */
		unread?: boolean;
		/** Hide the top divider (first row of a list). */
		first?: boolean;
		class?: string;
		/** Inline extra after the title (stars, chips). */
		titleExtra?: Snippet;
		/** Buttons on the right (Responder, Aceptar…). */
		actions?: Snippet;
	}

	const {
		title,
		meta,
		description,
		icon: Icon,
		tone = 'brand',
		href,
		unread = false,
		first = false,
		class: className = '',
		titleExtra,
		actions
	}: ActionRowProps = $props();

	const TONES: Record<ActionRowTone, string> = {
		brand: 'bg-brand-500/12 text-brand-700 dark:text-brand-300',
		info: 'bg-sky-500/12 text-sky-700 dark:text-sky-300',
		warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
		danger: 'bg-red-500/12 text-red-700 dark:text-red-300',
		neutral: 'bg-surface-overlay text-secondary'
	};
</script>

{#snippet body()}
	<span class="gap-1.5 flex items-center">
		{#if unread}<span class="h-2 w-2 bg-brand-500 shrink-0 rounded-full" aria-label="Nuevo"
			></span>{/if}
		<span class="text-sm font-semibold text-primary truncate">{title}</span>
		{#if titleExtra}{@render titleExtra()}{/if}
		{#if meta}<span class="text-xs text-muted shrink-0">· {meta}</span>{/if}
	</span>
	{#if description}<span class="text-muted block truncate text-[13px]">{description}</span>{/if}
{/snippet}

<div class={['gap-3 py-3 flex items-center', !first && 'border-border border-t', className]}>
	{#if Icon}
		<span class={['h-9 w-9 rounded-xl flex shrink-0 items-center justify-center', TONES[tone]]}>
			<Icon class="h-[18px] w-[18px]" strokeWidth={1.9} />
		</span>
	{/if}
	{#if href}
		<a
			{href}
			class="min-w-0 rounded-lg focus-visible:ring-brand-500/30 flex-1 focus-visible:ring-2 focus-visible:outline-none"
			>{@render body()}</a
		>
	{:else}
		<div class="min-w-0 flex-1">{@render body()}</div>
	{/if}
	{#if actions}<div class="gap-2 flex shrink-0 items-center">{@render actions()}</div>{/if}
</div>
