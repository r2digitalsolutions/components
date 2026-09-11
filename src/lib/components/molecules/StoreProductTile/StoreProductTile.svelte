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
		/**
		 * Estado legible en el listado (p. ej. «Activo», «En licencia», «No incluido»).
		 * Si no se pasa y `installed`, se usa «Activo».
		 */
		statusLabel?: string;
		/** landscape promotional card */
		featured?: boolean;
		/** Compact row for list view (ignored when featured). */
		layout?: 'grid' | 'list';
		tags?: StoreProductTag[];
		icon: Component;
		accentClass?: string;
		/** Prefer link navigation when set (store detail URLs). */
		href?: string;
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
		statusLabel = '',
		featured = false,
		layout = 'grid',
		tags = [],
		icon: Icon,
		accentClass = 'from-neutral-800 to-neutral-600',
		href = '',
		onclick,
		badge
	}: Props = $props();

	const TAG_PRIORITY: StoreProductTag[] = ['featured', 'new', 'popular'];

	const visibleTags = $derived(
		tags.filter((t): t is StoreProductTag => t === 'new' || t === 'featured' || t === 'popular')
	);

	/** Max 2 chips so the promo header stays one row. */
	const displayTags = $derived(
		TAG_PRIORITY.filter((t) => visibleTags.includes(t)).slice(0, installed ? 1 : 2)
	);

	const resolvedStatus = $derived(
		statusLabel.trim() || (installed ? 'Activo' : '')
	);
	const statusToneOk = $derived(
		installed || resolvedStatus === 'Activo' || resolvedStatus === 'Instalado'
	);
	const isList = $derived(!featured && layout === 'list');
	const rootClass = $derived(
		[
			'group ms-tile',
			featured && 'ms-tile--featured',
			isList && 'ms-tile--list'
		]
			.filter(Boolean)
			.join(' ')
	);

	function tagVariant(tag: StoreProductTag): 'info' | 'warning' | 'default' {
		if (tag === 'new') return 'info';
		if (tag === 'featured') return 'default';
		return 'default';
	}

	function tagClass(tag: StoreProductTag): string {
		if (tag === 'featured') {
			return '!border-0 !bg-amber-500 !text-white dark:!bg-amber-500 dark:!text-white';
		}
		if (tag === 'popular') {
			return 'border-0 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';
		}
		return '';
	}

	function onActivate(e: MouseEvent) {
		if (href) return;
		e.preventDefault();
		onclick?.();
	}
</script>

{#snippet body()}
	{#if featured}
		<div class="ms-tile__promo bg-gradient-to-br {accentClass}">
			<div class="ms-tile__promo-mesh" aria-hidden="true"></div>
			{#if displayTags.length || resolvedStatus || badge}
				<div class="ms-tile__tags">
					{#if badge}
						{@render badge()}
					{:else}
						{#each displayTags as tag (tag)}
							<Badge variant={tagVariant(tag)} size="sm" class={tagClass(tag)}>
								{TAG_LABELS[tag]}
							</Badge>
						{/each}
						{#if resolvedStatus}
							<Badge variant={statusToneOk ? 'success' : 'secondary'} size="sm">
								{resolvedStatus}
							</Badge>
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
				<span class="ms-tile__promo-price">
					{#if resolvedStatus && statusToneOk}
						{resolvedStatus}
						<span class="ms-tile__promo-sep" aria-hidden="true">·</span>
					{/if}
					{priceLabel}
				</span>
			</div>
			<div class="ms-tile__promo-icon bg-gradient-to-br {accentClass}">
				<Icon class="size-10 text-white drop-shadow" />
			</div>
		</div>
	{:else if isList}
		<div class="ms-tile__list-icon bg-gradient-to-br {accentClass}">
			<div class="ms-tile__icon-shine" aria-hidden="true"></div>
			<Icon class="relative size-7 text-white drop-shadow-sm" />
		</div>
		<div class="ms-tile__list-body">
			<div class="ms-tile__list-top">
				<span class="ms-tile__name">{name}</span>
				{#if resolvedStatus}
					<Badge variant={statusToneOk ? 'success' : 'secondary'} size="sm">
						{resolvedStatus}
					</Badge>
				{:else if displayTags[0]}
					<Badge
						variant={tagVariant(displayTags[0])}
						size="sm"
						class={tagClass(displayTags[0])}
					>
						{TAG_LABELS[displayTags[0]]}
					</Badge>
				{/if}
			</div>
			{#if description}
				<span class="ms-tile__list-desc">{description}</span>
			{/if}
			<div class="ms-tile__list-meta">
				{#if categoryLabel}
					<span>{categoryLabel}</span>
					<span aria-hidden="true">·</span>
				{/if}
				<span class="ms-tile__price">{priceLabel}</span>
				<span aria-hidden="true">·</span>
				<span class="ms-tile__publisher">Evoteg</span>
			</div>
		</div>
	{:else}
		<div class="ms-tile__icon-shell">
			<div class="ms-tile__icon bg-gradient-to-br {accentClass}">
				<div class="ms-tile__icon-shine" aria-hidden="true"></div>
				<Icon class="relative size-9 text-white drop-shadow-sm sm:size-10" />
			</div>
			{#if statusToneOk}
				<span class="ms-tile__corner">
					<Badge variant="success" size="sm">{resolvedStatus || 'Activo'}</Badge>
				</span>
			{:else if displayTags[0]}
				<span class="ms-tile__corner">
					<Badge
						variant={tagVariant(displayTags[0])}
						size="sm"
						class={tagClass(displayTags[0])}
					>
						{TAG_LABELS[displayTags[0]]}
					</Badge>
				</span>
			{:else if resolvedStatus}
				<span class="ms-tile__corner">
					<Badge variant="secondary" size="sm">{resolvedStatus}</Badge>
				</span>
			{/if}
		</div>
		<div class="ms-tile__meta">
			<span class="ms-tile__name">{name}</span>
			<span class="ms-tile__publisher">Evoteg</span>
			{#if resolvedStatus}
				<span
					class="ms-tile__status"
					class:ms-tile__status--ok={statusToneOk}
				>
					{resolvedStatus}
				</span>
			{/if}
			<span class="ms-tile__price">{priceLabel}</span>
		</div>
	{/if}
{/snippet}

{#if href}
	<a class={rootClass} {href} data-sveltekit-preload-data="hover">
		{@render body()}
	</a>
{:else}
	<button type="button" class={rootClass} onclick={onActivate}>
		{@render body()}
	</button>
{/if}

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
		text-decoration: none;
		color: inherit;
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
	.ms-tile--list {
		flex-direction: row;
		align-items: center;
		gap: 0.9rem;
		padding: 0.75rem 0.85rem;
		border-radius: 1rem;
		background: rgb(255 255 255 / 0.78);
		border: 1px solid rgb(0 0 0 / 0.06);
		box-shadow: 0 6px 18px rgb(0 0 0 / 0.04);
	}
	.ms-tile--list:hover {
		transform: translateY(-1px);
		border-color: rgb(0 0 0 / 0.1);
	}
	:global(.dark) .ms-tile--list {
		background: rgb(23 23 23 / 0.88);
		border-color: rgb(255 255 255 / 0.06);
	}
	.ms-tile__list-icon {
		position: relative;
		display: grid;
		place-items: center;
		width: 3.25rem;
		height: 3.25rem;
		border-radius: 22%;
		flex-shrink: 0;
		overflow: hidden;
		box-shadow:
			0 8px 18px rgb(0 0 0 / 0.2),
			0 1px 0 rgb(255 255 255 / 0.2) inset;
	}
	.ms-tile__list-body {
		min-width: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.ms-tile__list-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.ms-tile__list-desc {
		font-size: 0.8rem;
		line-height: 1.35;
		color: var(--color-neutral-600, #525252);
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	:global(.dark) .ms-tile__list-desc {
		color: var(--color-neutral-400, #a3a3a3);
	}
	.ms-tile__list-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.75rem;
		color: var(--color-neutral-500, #737373);
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
	.ms-tile__price,
	.ms-tile__status {
		color: var(--color-neutral-500, #737373);
		font-size: 0.75rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.ms-tile__status {
		font-weight: 600;
		color: var(--color-neutral-600, #525252);
	}
	.ms-tile__status--ok {
		color: #15803d;
	}
	:global(.dark) .ms-tile__status {
		color: var(--color-neutral-400, #a3a3a3);
	}
	:global(.dark) .ms-tile__status--ok {
		color: #4ade80;
	}
	.ms-tile__price {
		font-weight: 550;
		color: var(--color-neutral-700, #404040);
	}
	:global(.dark) .ms-tile__price {
		color: var(--color-neutral-300, #d4d4d4);
	}
	.ms-tile__promo-sep {
		margin-inline: 0.25rem;
		opacity: 0.65;
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
		flex-wrap: nowrap;
		align-items: center;
		gap: 0.35rem;
		max-width: calc(100% - 5.5rem);
		overflow: hidden;
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
