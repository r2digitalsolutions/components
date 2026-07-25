<script module lang="ts">
	export interface FooterLink {
		id: string;
		label: string;
		href?: string;
		external?: boolean;
		badge?: string;
		onclick?: (event: MouseEvent) => void;
	}

	export interface FooterGroup {
		id: string;
		title: string;
		links: FooterLink[];
	}

	export interface FooterSocial {
		id: string;
		label: string;
		href?: string;
		external?: boolean;
		onclick?: (event: MouseEvent) => void;
	}

	export type FooterVariant = 'default' | 'minimal' | 'centered' | 'mega' | 'compact';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface FooterProps {
		brand?: string;
		description?: string;
		groups?: FooterGroup[];
		/** Bottom bar legal / utility links */
		bottomLinks?: FooterLink[];
		social?: FooterSocial[];
		copyright?: string;
		variant?: FooterVariant;
		/** Optional status / version chip next to brand */
		badge?: string;
		contactEmail?: string;
		contactNote?: string;
		class?: string;
		brandSlot?: Snippet;
		/** Area under brand (e.g. newsletter form) */
		aside?: Snippet;
		legal?: Snippet;
		onnavigate?: (id: string, href?: string) => void;
		onsocial?: (id: string, href?: string) => void;
	}

	let {
		brand = 'R2DigiSolutions',
		description = 'Building thoughtful product interfaces.',
		groups = [],
		bottomLinks = [],
		social = [],
		copyright,
		variant = 'default',
		badge,
		contactEmail,
		contactNote,
		class: className = '',
		brandSlot,
		aside,
		legal,
		onnavigate,
		onsocial
	}: FooterProps = $props();

	const year = new Date().getFullYear();
	const resolvedCopyright = $derived(copyright ?? `© ${year} ${brand}. All rights reserved.`);

	const pad = $derived(
		variant === 'compact' ? 'py-6' : variant === 'mega' ? 'py-12' : 'py-10'
	);

	const maxW = $derived(variant === 'mega' ? 'max-w-7xl' : 'max-w-6xl');

	function handleLink(link: FooterLink, event: MouseEvent) {
		link.onclick?.(event);
		if (event.defaultPrevented) return;
		onnavigate?.(link.id, link.href);
	}

	function handleSocial(item: FooterSocial, event: MouseEvent) {
		item.onclick?.(event);
		if (event.defaultPrevented) return;
		onsocial?.(item.id, item.href);
	}
</script>

{#snippet linkItem(link: FooterLink, className: string)}
	{#if link.href}
		<a
			href={link.href}
			class={className}
			target={link.external ? '_blank' : undefined}
			rel={link.external ? 'noopener noreferrer' : undefined}
			onclick={(e) => handleLink(link, e)}
		>
			{link.label}
			{#if link.badge}
				<span
					class="rounded bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 dark:text-brand-300"
				>
					{link.badge}
				</span>
			{/if}
		</a>
	{:else}
		<button type="button" class={className} onclick={(e) => handleLink(link, e)}>
			{link.label}
			{#if link.badge}
				<span
					class="rounded bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 dark:text-brand-300"
				>
					{link.badge}
				</span>
			{/if}
		</button>
	{/if}
{/snippet}

{#snippet socialItem(item: FooterSocial, className: string)}
	{#if item.href}
		<a
			href={item.href}
			class={className}
			aria-label={item.label}
			target={item.external !== false ? '_blank' : undefined}
			rel={item.external !== false ? 'noopener noreferrer' : undefined}
			onclick={(e) => handleSocial(item, e)}
		>
			{item.label}
		</a>
	{:else}
		<button
			type="button"
			class={className}
			aria-label={item.label}
			onclick={(e) => handleSocial(item, e)}
		>
			{item.label}
		</button>
	{/if}
{/snippet}

<footer class={['w-full border-t border-border bg-surface-elevated', className]}>
	{#if variant === 'minimal'}
		<div
			class={[
				'mx-auto flex w-full flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6',
				maxW,
				pad
			]}
		>
			<div class="flex flex-wrap items-center gap-3">
				{#if brandSlot}
					{@render brandSlot()}
				{:else}
					<span class="text-sm font-semibold text-primary">{brand}</span>
				{/if}
				{#if badge}
					<span
						class="rounded-full bg-surface-overlay px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted"
					>
						{badge}
					</span>
				{/if}
			</div>
			{#if groups[0]?.links?.length}
				<nav class="flex flex-wrap gap-x-4 gap-y-2">
					{#each groups[0].links as link (link.id)}
						{@render linkItem(
							link,
							'text-sm text-secondary transition-colors hover:text-primary'
						)}
					{/each}
				</nav>
			{/if}
			<span class="text-xs text-muted">{resolvedCopyright}</span>
		</div>
	{:else if variant === 'centered'}
		<div class={['mx-auto w-full px-4 text-center sm:px-6', maxW, pad]}>
			{#if brandSlot}
				{@render brandSlot()}
			{:else}
				<p class="text-lg font-semibold text-primary">{brand}</p>
				{#if description}
					<p class="mx-auto mt-2 max-w-md text-sm text-secondary">{description}</p>
				{/if}
			{/if}

			{#if groups.length}
				<nav class="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
					{#each groups.flatMap((g) => g.links) as link (link.id)}
						{@render linkItem(
							link,
							'text-sm text-secondary transition-colors hover:text-primary'
						)}
					{/each}
				</nav>
			{/if}

			{#if social.length}
				<div class="mt-6 flex justify-center gap-2">
					{#each social as s (s.id)}
						{@render socialItem(
							s,
							'rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:border-border-strong hover:text-primary'
						)}
					{/each}
				</div>
			{/if}

			<p class="mt-8 text-xs text-muted">{resolvedCopyright}</p>
			{#if legal}
				<div class="mt-2 flex justify-center">
					{@render legal()}
				</div>
			{/if}
		</div>
	{:else if variant === 'compact'}
		<div
			class={[
				'mx-auto flex w-full flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6',
				maxW,
				pad
			]}
		>
			<span class="text-sm font-medium text-primary">{brand}</span>
			{#if bottomLinks.length || groups[0]?.links}
				<nav class="flex flex-wrap gap-x-4 gap-y-1">
					{#each bottomLinks.length ? bottomLinks : groups[0]?.links ?? [] as link (link.id)}
						{@render linkItem(link, 'text-xs text-secondary hover:text-primary')}
					{/each}
				</nav>
			{/if}
			<span class="text-xs text-muted">{resolvedCopyright}</span>
		</div>
	{:else}
		<div class={['mx-auto w-full px-4 sm:px-6', maxW, pad]}>
			<div
				class={[
					'grid gap-8',
					variant === 'mega' ? 'lg:grid-cols-[1.1fr_2.4fr]' : 'md:grid-cols-[1.2fr_2fr]'
				]}
			>
				<div class="space-y-3">
					{#if brandSlot}
						{@render brandSlot()}
					{:else}
						<div class="flex flex-wrap items-center gap-2">
							<p class="text-base font-semibold text-primary">{brand}</p>
							{#if badge}
								<span
									class="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300"
								>
									{badge}
								</span>
							{/if}
						</div>
						{#if description}
							<p class="max-w-sm text-sm text-secondary">{description}</p>
						{/if}
					{/if}

					{#if contactEmail || contactNote}
						<div class="space-y-1 pt-1 text-sm">
							{#if contactEmail}
								<a
									class="text-secondary transition-colors hover:text-primary"
									href={`mailto:${contactEmail}`}
								>
									{contactEmail}
								</a>
							{/if}
							{#if contactNote}
								<p class="text-xs text-muted">{contactNote}</p>
							{/if}
						</div>
					{/if}

					{#if social.length}
						<div class="flex flex-wrap gap-2 pt-1">
							{#each social as s (s.id)}
								{@render socialItem(
									s,
									'rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-secondary transition-colors hover:border-border-strong hover:text-primary'
								)}
							{/each}
						</div>
					{/if}

					{#if aside}
						<div class="pt-2">
							{@render aside()}
						</div>
					{/if}
				</div>

				<div
					class={[
						'grid gap-6',
						variant === 'mega'
							? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
							: 'grid-cols-2 sm:grid-cols-3'
					]}
				>
					{#each groups as group (group.id)}
						<div>
							<p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
								{group.title}
							</p>
							<ul class="space-y-2">
								{#each group.links as link (link.id)}
									<li>
										{@render linkItem(
											link,
											'inline-flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-primary'
										)}
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div
			class={[
				'mx-auto flex w-full flex-col gap-2 border-t border-border px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6',
				maxW
			]}
		>
			<span>{resolvedCopyright}</span>
			<div class="flex flex-wrap items-center gap-x-4 gap-y-1">
				{#if bottomLinks.length}
					{#each bottomLinks as link (link.id)}
						{@render linkItem(link, 'transition-colors hover:text-primary')}
					{/each}
				{/if}
				{#if legal}
					{@render legal()}
				{/if}
			</div>
		</div>
	{/if}
</footer>
