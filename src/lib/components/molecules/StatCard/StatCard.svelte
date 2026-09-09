<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import type { CardVariant } from '$lib/components/molecules/Card/Card.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

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
		class?: string;
		icon?: Snippet;
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
		class: className = '',
		icon,
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
		<div class="min-w-0 space-y-1">
			<div class="gap-2 flex flex-wrap items-center">
				<p class={['font-medium text-secondary', compact ? 'text-xs' : 'text-sm']}>{label}</p>
				{#if badge}
					<Badge variant={badgeVariant} size="sm">{badge}</Badge>
				{/if}
			</div>
			<p
				class={[
					'min-w-0 font-semibold tracking-tight text-primary',
					compact ? 'text-lg leading-snug' : 'text-2xl'
				]}
			>
				{value}
			</p>
			{#if delta || description}
				<div class="gap-2 text-xs flex flex-wrap items-center">
					{#if delta}
						<span
							class={[
								'gap-0.5 font-medium inline-flex items-center',
								trend === 'up' && 'text-green-600 dark:text-green-400',
								trend === 'down' && 'text-red-600 dark:text-red-400',
								trend === 'neutral' && 'text-muted'
							]}
						>
							{#if trend === 'up'}
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
					'rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 flex shrink-0 items-center justify-center',
					compact ? 'h-8 w-8' : 'h-10 w-10'
				]}
			>
				{@render icon()}
			</div>
		{/if}
	</div>
</Card>
