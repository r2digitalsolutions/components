<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface FooterLink {
		id: string;
		label: string;
		href?: string;
	}

	export interface FooterGroup {
		id: string;
		title: string;
		links: FooterLink[];
	}

	interface FooterProps {
		brand?: string;
		description?: string;
		groups?: FooterGroup[];
		copyright?: string;
		class?: string;
		brandSlot?: Snippet;
		legal?: Snippet;
		onnavigate?: (id: string, href?: string) => void;
	}

	let {
		brand = 'R2DigiSolutions',
		description = 'Building thoughtful product interfaces.',
		groups = [],
		copyright,
		class: className = '',
		brandSlot,
		legal,
		onnavigate
	}: FooterProps = $props();

	const year = new Date().getFullYear();
	const resolvedCopyright = $derived(copyright ?? `© ${year} ${brand}. All rights reserved.`);
</script>

<footer class={['w-full border-t border-border bg-surface-elevated', className]}>
	<div class="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_2fr]">
		<div class="space-y-3">
			{#if brandSlot}
				{@render brandSlot()}
			{:else}
				<p class="text-base font-semibold text-primary">{brand}</p>
				{#if description}
					<p class="max-w-sm text-sm text-secondary">{description}</p>
				{/if}
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-6 sm:grid-cols-3">
			{#each groups as group (group.id)}
				<div>
					<p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{group.title}</p>
					<ul class="space-y-2">
						{#each group.links as link (link.id)}
							<li>
								<button
									type="button"
									class="text-sm text-secondary transition-colors hover:text-primary"
									onclick={() => onnavigate?.(link.id, link.href)}
								>
									{link.label}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>

	<div
		class="mx-auto flex w-full max-w-6xl flex-col gap-2 border-t border-border px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6"
	>
		<span>{resolvedCopyright}</span>
		{#if legal}{@render legal()}{/if}
	</div>
</footer>
