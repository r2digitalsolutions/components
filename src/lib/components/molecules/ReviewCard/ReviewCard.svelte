<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Rating from '$lib/components/atoms/Rating/Rating.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import TimeAgo from '$lib/components/molecules/TimeAgo/TimeAgo.svelte';
	import Image from '$lib/components/atoms/Image/Image.svelte';
	import BadgeCheck from '@lucide/svelte/icons/badge-check';
	import ThumbsUp from '@lucide/svelte/icons/thumbs-up';
	import ThumbsDown from '@lucide/svelte/icons/thumbs-down';

	export type ReviewCardVariant = 'default' | 'compact' | 'quote';

	interface ReviewCardProps {
		author: string;
		avatar?: string;
		rating?: number;
		title?: string;
		body: string;
		date?: string | Date | number;
		verified?: boolean;
		/** Optional product context line */
		product?: string;
		location?: string;
		/** Photo URLs attached to the review */
		images?: string[];
		helpful?: number;
		notHelpful?: number;
		/** Clamp body and show “Read more” */
		clamp?: number;
		variant?: ReviewCardVariant;
		class?: string;
		onhelpful?: (helpful: boolean) => void;
		onreply?: () => void;
	}

	let {
		author,
		avatar,
		rating = 5,
		title,
		body,
		date,
		verified = false,
		product,
		location,
		images = [],
		helpful = $bindable(0),
		notHelpful = $bindable(0),
		clamp,
		variant = 'default',
		class: className = '',
		onhelpful,
		onreply
	}: ReviewCardProps = $props();

	let expanded = $state(false);
	let vote = $state<'up' | 'down' | null>(null);

	const isClamped = $derived(clamp !== undefined && !expanded && body.length > 0);

	function voteHelpful(up: boolean) {
		if (up) {
			if (vote === 'up') {
				helpful = Math.max(0, helpful - 1);
				vote = null;
				onhelpful?.(false);
				return;
			}
			if (vote === 'down') notHelpful = Math.max(0, notHelpful - 1);
			helpful += 1;
			vote = 'up';
			onhelpful?.(true);
		} else {
			if (vote === 'down') {
				notHelpful = Math.max(0, notHelpful - 1);
				vote = null;
				return;
			}
			if (vote === 'up') helpful = Math.max(0, helpful - 1);
			notHelpful += 1;
			vote = 'down';
			onhelpful?.(false);
		}
	}
</script>

<article
	class={[
		'rounded-2xl border border-border bg-surface-elevated',
		variant === 'compact' ? 'p-3' : 'p-4',
		variant === 'quote' && 'border-l-4 border-l-brand-500',
		className
	]}
>
	<div class="flex items-start gap-3">
		{#if variant !== 'quote'}
			<Avatar src={avatar} name={author} size={variant === 'compact' ? 'sm' : 'md'} />
		{/if}
		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
				<p class={['font-semibold text-primary', variant === 'compact' ? 'text-xs' : 'text-sm']}>
					{author}
				</p>
				{#if verified}
					<span
						class="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
					>
						<BadgeCheck class="h-3.5 w-3.5" aria-hidden="true" />
						Verified
					</span>
				{/if}
				{#if date}
					<span class="text-[11px] text-muted">
						<TimeAgo date={date} />
					</span>
				{/if}
			</div>

			{#if location || product}
				<p class="mt-0.5 text-[11px] text-muted">
					{#if product}<span class="text-secondary">{product}</span>{/if}
					{#if product && location}<span aria-hidden="true"> · </span>{/if}
					{#if location}{location}{/if}
				</p>
			{/if}

			{#if variant !== 'quote'}
				<div class="mt-1.5">
					<Rating value={rating} size="sm" readonly />
				</div>
			{:else}
				<div class="mt-1.5 flex items-center gap-2">
					<Rating value={rating} size="sm" readonly />
					{#if verified}
						<Badge size="sm" variant="success" rounded>Verified</Badge>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	{#if title}
		<p class={['font-medium text-primary', variant === 'compact' ? 'mt-2 text-xs' : 'mt-3 text-sm']}>
			{title}
		</p>
	{/if}

	<p
		class={[
			'leading-relaxed text-secondary',
			variant === 'quote' ? 'mt-2 text-sm italic' : 'mt-1.5 text-sm',
			variant === 'compact' && 'text-xs'
		]}
		style={isClamped && clamp
			? `-webkit-line-clamp: ${clamp}; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;`
			: undefined}
	>
		{#if variant === 'quote'}“{/if}{body}{#if variant === 'quote'}”{/if}
	</p>

	{#if clamp !== undefined && body.length > 120}
		<button
			type="button"
			class="mt-1 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
			onclick={() => (expanded = !expanded)}
		>
			{expanded ? 'Show less' : 'Read more'}
		</button>
	{/if}

	{#if images.length}
		<div class="mt-3 flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{#each images as src, i (src + i)}
				<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-overlay">
					<Image {src} alt={`Review photo ${i + 1}`} class="h-full w-full object-cover" />
				</div>
			{/each}
		</div>
	{/if}

	{#if onhelpful || onreply}
		<div class="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
			{#if onhelpful}
				<span class="mr-1 text-[11px] text-muted">Helpful?</span>
				<Button
					size="xs"
					variant={vote === 'up' ? 'secondary' : 'ghost'}
					onclick={() => voteHelpful(true)}
				>
					<ThumbsUp class="h-3.5 w-3.5" aria-hidden="true" />
					{helpful}
				</Button>
				<Button
					size="xs"
					variant={vote === 'down' ? 'secondary' : 'ghost'}
					onclick={() => voteHelpful(false)}
				>
					<ThumbsDown class="h-3.5 w-3.5" aria-hidden="true" />
					{notHelpful}
				</Button>
			{/if}
			{#if onreply}
				<Button size="xs" variant="ghost" class="ml-auto" onclick={() => onreply?.()}>
					Reply
				</Button>
			{/if}
		</div>
	{/if}
</article>
