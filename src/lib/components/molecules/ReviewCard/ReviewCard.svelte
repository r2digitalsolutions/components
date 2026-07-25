<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Rating from '$lib/components/atoms/Rating/Rating.svelte';
	import TimeAgo from '$lib/components/molecules/TimeAgo/TimeAgo.svelte';

	interface ReviewCardProps {
		author: string;
		avatar?: string;
		rating?: number;
		title?: string;
		body: string;
		date?: string | Date | number;
		verified?: boolean;
		class?: string;
	}

	const {
		author,
		avatar,
		rating = 5,
		title,
		body,
		date,
		verified = false,
		class: className = ''
	}: ReviewCardProps = $props();
</script>

<article class={['rounded-2xl border border-border bg-surface-elevated p-4', className]}>
	<div class="flex items-start gap-3">
		<Avatar src={avatar} name={author} size="md" />
		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
				<p class="text-sm font-semibold text-primary">{author}</p>
				{#if verified}
					<span class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Verified</span>
				{/if}
				{#if date}
					<span class="text-[11px] text-muted">
						<TimeAgo date={date} />
					</span>
				{/if}
			</div>
			<div class="mt-1">
				<Rating value={rating} size="sm" readonly />
			</div>
		</div>
	</div>
	{#if title}
		<p class="mt-3 text-sm font-medium text-primary">{title}</p>
	{/if}
	<p class="mt-1.5 text-sm leading-relaxed text-secondary">{body}</p>
</article>
