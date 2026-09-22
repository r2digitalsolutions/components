<script lang="ts">
	import type { Snippet } from 'svelte'
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte'
	import Image from '$lib/components/atoms/Image/Image.svelte'

	interface KnowledgeCardProps {
		title: string
		subtitle?: string
		coverUrl?: string
		avatarUrl?: string
		href?: string
		class?: string
		/** Snippet for action buttons below title/subtitle */
		actions?: Snippet
		children?: Snippet
	}

	let {
		title,
		subtitle,
		coverUrl,
		avatarUrl,
		href,
		class: className = '',
		actions,
		children
	}: KnowledgeCardProps = $props()

	const hasCover = $derived(!!coverUrl)
	const hasAvatar = $derived(!!avatarUrl || !!title)
</script>

<div
	class={[
		'overflow-hidden rounded-xl border border-border bg-surface-elevated',
		className
	]}
>
	<!-- Cover area -->
	{#if hasCover}
		<div class="relative w-full" style="aspect-ratio: 3/1">
			<Image
				src={coverUrl!}
				alt={title}
				aspectRatio="3/1"
				class="absolute inset-0 h-full w-full"
				rounded={false}
			/>
		</div>
	{:else}
		<div class="h-16 w-full bg-surface-overlay" style="aspect-ratio: 3/1"></div>
	{/if}

	<!-- Avatar overlapping -->
	{#if hasAvatar}
		<div class={['-mt-5 px-4', hasCover ? '-mt-6' : '-mt-5']}>
			<Avatar
				src={avatarUrl}
				name={title}
				size="lg"
				class="ring-2 ring-surface-elevated"
			/>
		</div>
	{/if}

	<!-- Body -->
	<div class="px-4 pb-4" class:pt-2={hasAvatar} class:pt-4={!hasAvatar}>
		{#if href}
			<a
				{href}
				class="block text-base font-semibold leading-snug text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
			>
				{title}
			</a>
		{:else}
			<p class="text-base font-semibold leading-snug text-primary">{title}</p>
		{/if}

		{#if subtitle}
			<p class="mt-0.5 text-sm text-muted">{subtitle}</p>
		{/if}

		{#if children}
			<div class="mt-3 border-t border-border/70 pt-3">
				{@render children()}
			</div>
		{/if}

		{#if actions}
			<div class="mt-3">
				{@render actions()}
			</div>
		{/if}
	</div>
</div>
