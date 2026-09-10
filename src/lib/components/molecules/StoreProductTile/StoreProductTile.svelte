<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	export type StoreProductTag = 'new' | 'featured' | 'popular';

	const TAG_LABELS: Record<StoreProductTag, string> = {
		new: 'Nuevo',
		featured: 'Destacado',
		popular: 'Popular'
	};

	type Props = {
		name: string;
		description?: string;
		priceLabel: string;
		categoryLabel?: string;
		installed?: boolean;
		/** landscape promotional card */
		featured?: boolean;
		tags?: StoreProductTag[];
		icon: Component;
		accentClass?: string;
		onclick?: () => void;
		/** Optional custom badge area */
		badge?: Snippet;
	};

	let {
		name,
		description = '',
		priceLabel,
		categoryLabel = '',
		installed = false,
		featured = false,
		tags = [],
		icon: Icon,
		accentClass = 'from-neutral-800 to-neutral-600',
		onclick,
		badge
	}: Props = $props();

	const visibleTags = $derived(
		tags.filter((t): t is StoreProductTag => t === 'new' || t === 'featured' || t === 'popular')
	);
</script>

<button
	type="button"
	class="group ms-tile"
	class:ms-tile--featured={featured}
	{onclick}
>
	{#if featured}
		<div class="ms-tile__promo bg-gradient-to-br {accentClass}">
			<div class="ms-tile__promo-mesh" aria-hidden="true"></div>
			{#if visibleTags.length || installed || badge}
				<div class="ms-tile__tags">
					{#if badge}
						{@render badge()}
					{:else}
						{#each visibleTags as tag (tag)}
							<Badge
								variant={tag === 'new' ? 'info' : tag === 'featured' ? 'primary' : 'secondary'}
								size="sm"
							>
								{TAG_LABELS[tag]}
							</Badge>
						{/each}
						{#if installed}
							<Badge variant="success" size="sm">Instalado</Badge>
						{/if}
					{/if}
				</div>
			{/if}
			<div class="ms-tile__promo-copy">
				{#if categoryLabel}
					<span class="ms-tile__eyebrow">{categoryLabel}</span>
				{/if}
				<span class="ms-tile__promo-title">{name}</span>
				{#if description}
					<span class="ms-tile__promo-desc">{description}</span>
				{/if}
				<span class="ms-tile__promo-price">{priceLabel}</span>
			</div>
			<div class="ms-tile__promo-icon bg-gradient-to-br {accentClass}">
				<Icon class="size-10 text-white drop-shadow" />
			</div>
		</div>
	{:else}
		<div class="ms-tile__icon-shell">
			<div class="ms-tile__icon bg-gradient-to-br {accentClass}">
				<div class="ms-tile__icon-shine" aria-hidden="true"></div>
				<Icon class="relative size-9 text-white drop-shadow-sm sm:size-10" />
			</div>
			{#if visibleTags[0]}
				<span class="ms-tile__corner">
					<Badge
						variant={visibleTags[0] === 'new'
							? 'info'
							: visibleTags[0] === 'featured'
								? 'primary'
								: 'secondary'}
						size="sm"
					>
						{TAG_LABELS[visibleTags[0]]}
					</Badge>
				</span>
			{:else if installed}
				<span class="ms-tile__dot" title="Instalado" aria-label="Instalado"></span>
			{/if}
		</div>
		<div class="ms-tile__meta">
			<span class="ms-tile__name">{name}</span>
			<span class="ms-tile__publisher">Evoteg</span>
			<span class="ms-tile__price">{priceLabel}</span>
		</div>
	{/if}
</button>

<style>
	.ms-tile {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		width: 100%;
		min-width: 0;
		text-align: left;
		border: 0;
		background: transparent;
		padding: 0;
		cursor: pointer;
		border-radius: 1rem;
		transition:
			transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
			filter 200ms ease;
	}
	.ms-tile:hover {
		transform: translateY(-3px);
	}
	.ms-tile:focus-visible {
		outline: 2px solid var(--color-brand-500, #2563eb);
		outline-offset: 4px;
	}
	.ms-tile__icon-shell {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		border-radius: 1.35rem;
		background: linear-gradient(180deg, rgb(255 255 255 / 0.9), rgb(245 245 245 / 0.95));
		box-shadow:
			0 1px 0 rgb(255 255 255 / 0.8) inset,
			0 1px 2px rgb(0 0 0 / 0.04),
			0 10px 28px rgb(0 0 0 / 0.07);
	}
	:global(.dark) .ms-tile__icon-shell {
		background: linear-gradient(180deg, rgb(38 38 38), rgb(28 28 28));
		box-shadow:
			0 1px 0 rgb(255 255 255 / 0.04) inset,
			0 10px 28px rgb(0 0 0 / 0.35);
	}
	.ms-tile__icon {
		position: relative;
		display: grid;
		place-items: center;
		width: 58%;
		aspect-ratio: 1;
		border-radius: 22%;
		overflow: hidden;
		box-shadow:
			0 8px 20px rgb(0 0 0 / 0.22),
			0 1px 0 rgb(255 255 255 / 0.2) inset;
		transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.ms-tile:hover .ms-tile__icon {
		transform: scale(1.04);
	}
	.ms-tile__icon-shine {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(135deg, rgb(255 255 255 / 0.35), transparent 42%),
			radial-gradient(circle at 70% 80%, rgb(0 0 0 / 0.2), transparent 55%);
	}
	.ms-tile__corner {
		position: absolute;
		top: 0.45rem;
		left: 0.45rem;
		z-index: 2;
	}
	.ms-tile__dot {
		position: absolute;
		top: 0.55rem;
		right: 0.55rem;
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 999px;
		background: #16a34a;
		box-shadow: 0 0 0 3px rgb(255 255 255 / 0.9);
	}
	:global(.dark) .ms-tile__dot {
		box-shadow: 0 0 0 3px rgb(28 28 28);
	}
	.ms-tile__meta {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		padding-inline: 0.2rem;
	}
	.ms-tile__name {
		color: var(--color-neutral-900, #171717);
		font-size: 0.875rem;
		font-weight: 650;
		letter-spacing: -0.01em;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	:global(.dark) .ms-tile__name {
		color: var(--color-neutral-50, #fafafa);
	}
	.ms-tile__publisher,
	.ms-tile__price {
		color: var(--color-neutral-500, #737373);
		font-size: 0.75rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.ms-tile__price {
		font-weight: 550;
		color: var(--color-neutral-700, #404040);
	}
	:global(.dark) .ms-tile__price {
		color: var(--color-neutral-300, #d4d4d4);
	}

	.ms-tile--featured {
		height: 100%;
	}
	.ms-tile__promo {
		position: relative;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		min-height: 11.5rem;
		padding: 1.15rem 1.15rem 1.2rem;
		border-radius: 1.35rem;
		overflow: hidden;
		color: white;
		box-shadow:
			0 1px 0 rgb(255 255 255 / 0.12) inset,
			0 16px 40px rgb(0 0 0 / 0.18);
		transition: box-shadow 220ms ease;
	}
	.ms-tile:hover .ms-tile__promo {
		box-shadow:
			0 1px 0 rgb(255 255 255 / 0.16) inset,
			0 22px 48px rgb(0 0 0 / 0.24);
	}
	.ms-tile__promo-mesh {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 12% 18%, rgb(255 255 255 / 0.28), transparent 40%),
			radial-gradient(circle at 88% 78%, rgb(0 0 0 / 0.28), transparent 48%),
			linear-gradient(120deg, transparent 40%, rgb(255 255 255 / 0.06) 100%);
	}
	.ms-tile__tags {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		z-index: 2;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		max-width: calc(100% - 5.5rem);
	}
	.ms-tile__promo-copy {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		min-width: 0;
		max-width: 70%;
	}
	.ms-tile__eyebrow {
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgb(255 255 255 / 0.72);
	}
	.ms-tile__promo-title {
		font-size: 1.15rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.15;
	}
	.ms-tile__promo-desc {
		font-size: 0.78rem;
		line-height: 1.35;
		color: rgb(255 255 255 / 0.82);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.ms-tile__promo-price {
		margin-top: 0.25rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: rgb(255 255 255 / 0.92);
	}
	.ms-tile__promo-icon {
		position: relative;
		z-index: 1;
		display: grid;
		place-items: center;
		width: 4.25rem;
		height: 4.25rem;
		border-radius: 22%;
		flex-shrink: 0;
		box-shadow:
			0 12px 28px rgb(0 0 0 / 0.28),
			0 1px 0 rgb(255 255 255 / 0.25) inset;
		border: 1px solid rgb(255 255 255 / 0.18);
		transform: translateY(-0.15rem);
		transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.ms-tile:hover .ms-tile__promo-icon {
		transform: translateY(-0.35rem) scale(1.03);
	}
</style>
