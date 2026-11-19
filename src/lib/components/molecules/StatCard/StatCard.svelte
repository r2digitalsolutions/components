<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import type { CardVariant } from '$lib/components/molecules/Card/Card.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Sparkline from '$lib/components/atoms/Sparkline/Sparkline.svelte';

	export type StatCardTrend = 'up' | 'down' | 'neutral';
	export type StatCardSize = 'sm' | 'md';

	interface StatCardProps {
		label: string;
		value: string | number;
		delta?: string;
		trend?: StatCardTrend;
		description?: string;
		badge?: string;
		badgeVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
		variant?: CardVariant;
		size?: StatCardSize;
		/** Brand tint (default) or gray icon well */
		iconTone?: 'brand' | 'neutral';
		/** Mini trend line at the bottom-right (e.g. last 8 weeks). */
		sparkline?: number[];
		sparklineTone?: 'brand' | 'success' | 'warning' | 'error' | 'neutral';
		class?: string;
		icon?: Snippet;
		/** Small icon before the label (workspace look); does not hide the sparkline. */
		labelIcon?: Component<{ class?: string; size?: number | string; strokeWidth?: number | string }>;
		/** `pill` puts the delta in a small tinted chip (+12%). */
		deltaStyle?: 'text' | 'pill';
		onclick?: (e: MouseEvent) => void;
	}

	const {
		label,
		value,
		delta,
		trend = 'neutral',
		description,
		badge,
		badgeVariant = 'primary',
		variant = 'default',
		size = 'md',
		iconTone = 'brand',
		sparkline,
		sparklineTone = 'brand',
		class: className = '',
		icon,
		labelIcon: LabelIcon,
		deltaStyle = 'text',
		onclick
	}: StatCardProps = $props();

	const compact = $derived(size === 'sm');
</script>

<Card
	{variant}
	padding={compact ? 'sm' : 'md'}
	hoverable={!!onclick}
	{onclick}
	class={className}
	chrome={false}
>
	<div class="gap-3 flex items-start justify-between">
		<div class="min-w-0 space-y-1 flex-1">
			<div class="gap-2 flex flex-wrap items-center">
				<p
					class={[
						'gap-1.5 font-medium text-secondary inline-flex items-center',
						compact ? 'text-xs' : 'text-sm'
					]}
				>
					{#if LabelIcon}<LabelIcon class="h-3.5 w-3.5 text-muted" strokeWidth={2} />{/if}{label}
				</p>
				{#if badge}
					<Badge variant={badgeVariant} size="sm">{badge}</Badge>
				{/if}
			</div>
			<div class="gap-3 flex items-end justify-between">
				<p
					class={[
						'min-w-0 font-semibold tracking-tight text-primary',
						compact ? 'text-lg leading-snug' : 'text-2xl'
					]}
				>
					{value}
				</p>
				{#if sparkline && sparkline.length > 1 && !icon}
					<Sparkline
						data={sparkline}
						tone={sparklineTone}
						width={compact ? 72 : 96}
						height={compact ? 26 : 34}
						class="shrink-0"
					/>
				{/if}
			</div>
			{#if delta || description}
				<div class="gap-2 text-xs flex flex-wrap items-center">
					{#if delta}
						<span
							class={[
								'gap-0.5 font-medium inline-flex items-center',
								deltaStyle === 'pill' && 'px-1.5 py-0.5 font-semibold rounded-md',
								deltaStyle === 'pill' && trend === 'down'
									? 'bg-red-500/10 text-red-700 dark:text-red-300'
									: deltaStyle === 'pill'
										? 'bg-brand-500/12 text-brand-700 dark:text-brand-300'
										: '',
								deltaStyle === 'text' && trend === 'up' && 'text-green-600 dark:text-green-400',
								deltaStyle === 'text' && trend === 'down' && 'text-red-600 dark:text-red-400',
								deltaStyle === 'text' && trend === 'neutral' && 'text-muted'
							]}
						>
							{#if deltaStyle === 'pill'}{:else if trend === 'up'}
								<svg
									class="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
								</svg>
							{:else if trend === 'down'}
								<svg
									class="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
								</svg>
							{/if}
							{delta}
						</span>
					{/if}
					{#if description}
						<span class="text-muted">{description}</span>
					{/if}
				</div>
			{/if}
		</div>
		{#if icon}
			<div
				class={[
					'rounded-xl flex shrink-0 items-center justify-center',
					iconTone === 'neutral'
						? 'bg-surface-overlay text-secondary'
						: 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400',
					compact ? 'h-8 w-8' : 'h-10 w-10'
				]}
			>
				{@render icon()}
			</div>
		{/if}
	</div>
</Card>
