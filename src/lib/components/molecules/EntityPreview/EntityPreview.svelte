<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import SkeletonAvatar from '$lib/components/atoms/SkeletonAvatar/SkeletonAvatar.svelte';

	interface EntityPreviewProps {
		title: string;
		subtitle?: string;
		meta?: string;
		image?: string;
		kind?: string;
		class?: string;
		href?: string;
		onclick?: () => void;
	}

	const {
		title,
		subtitle = '',
		meta = '',
		image,
		kind = '',
		class: className = '',
		href,
		onclick
	}: EntityPreviewProps = $props();

	const baseClass =
		'flex w-full items-center gap-3 rounded-xl border border-border bg-surface-elevated p-3 text-left';
	const interactiveClass =
		'transition-colors hover:border-brand-500/30 hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30';
</script>

{#snippet body()}
	{#if image}
		<img src={image} alt="" class="h-10 w-10 shrink-0 rounded-lg object-cover" />
	{:else}
		<SkeletonAvatar size="md" shape="rounded" class="shrink-0" />
	{/if}

	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<p class="truncate text-sm font-semibold text-primary">{title}</p>
			{#if kind}
				<Badge size="sm" variant="secondary">{kind}</Badge>
			{/if}
		</div>
		{#if subtitle}
			<p class="mt-0.5 truncate text-xs text-muted">{subtitle}</p>
		{/if}
	</div>

	{#if meta}
		<span class="shrink-0 text-[11px] tabular-nums text-muted">{meta}</span>
	{/if}
{/snippet}

{#if href}
	<a href={href} class={[baseClass, interactiveClass, className]}>
		{@render body()}
	</a>
{:else if onclick}
	<button type="button" class={[baseClass, interactiveClass, className]} onclick={() => onclick?.()}>
		{@render body()}
	</button>
{:else}
	<div class={[baseClass, className]}>
		{@render body()}
	</div>
{/if}
