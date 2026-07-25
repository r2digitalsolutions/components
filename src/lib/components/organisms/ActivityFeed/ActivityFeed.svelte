<script module lang="ts">
	export type ActivityType = 'default' | 'info' | 'success' | 'warning' | 'error';

	export interface ActivityItem {
		id: string;
		actor: string;
		avatar?: string;
		/** Short verb, e.g. "published", "commented on" */
		action: string;
		target?: string;
		/** Makes the target a link; also used when the whole row is clickable */
		href?: string;
		date: Date | string | number;
		meta?: string;
		type?: ActivityType;
		tags?: string[];
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import ScrollArea from '$lib/components/atoms/ScrollArea/ScrollArea.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import TimeAgo from '$lib/components/molecules/TimeAgo/TimeAgo.svelte';

	interface ActivityFeedProps {
		items?: ActivityItem[];
		size?: 'sm' | 'md';
		showConnectors?: boolean;
		loading?: boolean;
		emptyTitle?: string;
		emptyDescription?: string;
		maxHeight?: string | number;
		'aria-label'?: string;
		class?: string;
		footer?: Snippet;
		onitemclick?: (item: ActivityItem) => void;
	}

	let {
		items = [],
		size = 'md',
		showConnectors = true,
		loading = false,
		emptyTitle = 'No activity yet',
		emptyDescription = 'When people take action, it will show up here.',
		maxHeight,
		'aria-label': ariaLabel = 'Activity',
		class: className = '',
		footer,
		onitemclick
	}: ActivityFeedProps = $props();

	const typeDot: Record<ActivityType, string> = {
		default: 'bg-brand-500',
		info: 'bg-sky-500',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500'
	};

	const typeBadge: Record<ActivityType, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
		default: 'default',
		info: 'info',
		success: 'success',
		warning: 'warning',
		error: 'error'
	};

	const sizeClasses = $derived(
		{
			sm: {
				avatar: 'xs' as const,
				rail: 'w-6',
				gap: 'gap-2.5',
				pad: 'pb-4',
				title: 'text-xs',
				meta: 'text-[11px]',
				node: 'h-6 w-6',
				dot: 'h-2 w-2',
				lineTop: 'top-6',
				lineBottom: '-bottom-2.5'
			},
			md: {
				avatar: 'sm' as const,
				rail: 'w-8',
				gap: 'gap-3',
				pad: 'pb-5',
				title: 'text-sm',
				meta: 'text-xs',
				node: 'h-8 w-8',
				dot: 'h-2.5 w-2.5',
				lineTop: 'top-8',
				lineBottom: '-bottom-3'
			}
		}[size]
	);

	function handleActivate(item: ActivityItem, event: MouseEvent) {
		if ((event.target as HTMLElement | null)?.closest('a')) return;
		onitemclick?.(item);
	}

	function handleKeydown(item: ActivityItem, event: KeyboardEvent) {
		if (!onitemclick) return;
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		onitemclick(item);
	}
</script>

{#snippet feedList()}
	<ol class="relative flex flex-col overflow-visible" aria-label={ariaLabel}>
		{#each items as item, index (item.id)}
			{@const isLast = index === items.length - 1}
			{@const interactive = !!onitemclick}
			<li class={['relative flex overflow-visible', sizeClasses.gap]}>
				<div
					class={[
						'relative flex shrink-0 flex-col items-center self-stretch overflow-visible',
						sizeClasses.rail
					]}
				>
					{#if item.avatar || item.actor}
						<span
							class={[
								'relative z-10 flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-elevated ring-4 ring-surface',
								sizeClasses.node
							]}
						>
							<Avatar
								name={item.actor}
								src={item.avatar}
								size={sizeClasses.avatar}
								ringed={false}
							/>
						</span>
					{:else}
						<span
							class={[
								'relative z-10 mt-1.5 shrink-0 rounded-full ring-4 ring-surface',
								sizeClasses.dot,
								typeDot[item.type ?? 'default']
							]}
							aria-hidden="true"
						></span>
					{/if}

					{#if showConnectors && !isLast}
						<span
							class={[
								'absolute left-1/2 z-0 w-0.5 -translate-x-1/2 bg-border',
								sizeClasses.lineTop,
								sizeClasses.lineBottom
							]}
							aria-hidden="true"
						></span>
					{/if}
				</div>

				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<div
					class={[
						'min-w-0 flex-1 rounded-xl transition-colors',
						!isLast && sizeClasses.pad,
						interactive &&
							'-mx-2 cursor-pointer px-2 py-1 hover:bg-surface-overlay/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30'
					]}
					role={interactive ? 'button' : undefined}
					tabindex={interactive ? 0 : undefined}
					onclick={interactive ? (e) => handleActivate(item, e) : undefined}
					onkeydown={interactive ? (e) => handleKeydown(item, e) : undefined}
				>
					<div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
						<p class={['min-w-0 text-primary', sizeClasses.title]}>
							<span class="font-medium">{item.actor}</span>
							<span class="text-secondary"> {item.action} </span>
							{#if item.target}
								{#if item.href}
									<a
										href={item.href}
										class="font-medium text-brand-600 hover:underline dark:text-brand-400"
										onclick={(e) => e.stopPropagation()}
									>
										{item.target}
									</a>
								{:else}
									<span class="font-medium">{item.target}</span>
								{/if}
							{/if}
						</p>
						<TimeAgo date={item.date} class={`shrink-0 text-muted ${sizeClasses.meta}`} />
					</div>

					{#if item.meta || (item.tags && item.tags.length > 0) || item.type}
						<div class={['mt-1 flex flex-wrap items-center gap-1.5', sizeClasses.meta]}>
							{#if item.type && item.type !== 'default'}
								<Badge size="sm" variant={typeBadge[item.type]} dot>{item.type}</Badge>
							{/if}
							{#if item.meta}
								<span class="text-muted">{item.meta}</span>
							{/if}
							{#each item.tags ?? [] as tag (tag)}
								<Badge size="sm" variant="secondary">{tag}</Badge>
							{/each}
						</div>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
{/snippet}

<div class={['w-full', className]}>
	{#if loading}
		<div class="space-y-4 py-1" aria-busy="true" aria-label="Loading activity">
			{#each [1, 2, 3] as n (n)}
				<div class="flex gap-3">
					<div class={['shrink-0 animate-pulse rounded-full bg-surface-overlay', sizeClasses.node]}></div>
					<div class="min-w-0 flex-1 space-y-2 pt-1">
						<div class="h-3 w-3/4 max-w-xs animate-pulse rounded bg-surface-overlay"></div>
						<div class="h-2.5 w-1/3 max-w-32 animate-pulse rounded bg-surface-overlay"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else if items.length === 0}
		<EmptyState title={emptyTitle} description={emptyDescription} class="border-0 bg-transparent" />
	{:else if maxHeight}
		<ScrollArea {maxHeight} class="pr-1">
			{@render feedList()}
		</ScrollArea>
	{:else}
		{@render feedList()}
	{/if}

	{#if footer && !loading}
		<div class="mt-4 border-t border-border pt-3">
			{@render footer()}
		</div>
	{/if}
</div>
