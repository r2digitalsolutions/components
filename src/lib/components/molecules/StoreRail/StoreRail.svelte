<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	type Props = {
		title: string;
		subtitle?: string;
		children: Snippet;
		wide?: boolean;
		/** Soft edge fades (narrow by default). */
		fade?: boolean;
		class?: string;
	};

	let {
		title,
		subtitle = '',
		children,
		wide = false,
		fade = true,
		class: className = ''
	}: Props = $props();

	let track = $state<HTMLDivElement | null>(null);

	function scrollByDir(dir: -1 | 1) {
		if (!track) return;
		const amount = Math.max(240, track.clientWidth * 0.72) * dir;
		track.scrollBy({ left: amount, behavior: 'smooth' });
	}
</script>

<section class="ms-rail {className}">
	<div class="ms-rail__head">
		<div class="min-w-0">
			<h2 class="ms-rail__title">{title}</h2>
			{#if subtitle}
				<p class="ms-rail__subtitle">{subtitle}</p>
			{/if}
		</div>
		<div class="ms-rail__controls">
			<Button
				variant="secondary"
				size="sm"
				onclick={() => scrollByDir(-1)}
				aria-label="Desplazar a la izquierda"
			>
				<ChevronLeft class="size-4" />
			</Button>
			<Button
				variant="secondary"
				size="sm"
				onclick={() => scrollByDir(1)}
				aria-label="Desplazar a la derecha"
			>
				<ChevronRight class="size-4" />
			</Button>
		</div>
	</div>

	<div class="ms-rail__viewport">
		<div class="ms-rail__track" class:ms-rail__track--wide={wide} bind:this={track}>
			{@render children()}
		</div>
		{#if fade}
			<div class="ms-rail__fade ms-rail__fade--left" aria-hidden="true"></div>
			<div class="ms-rail__fade ms-rail__fade--right" aria-hidden="true"></div>
		{/if}
	</div>
</section>

<style>
	.ms-rail {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}
	.ms-rail__head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		padding-inline: 0.1rem;
	}
	.ms-rail__title {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--color-neutral-900, #171717);
	}
	:global(.dark) .ms-rail__title {
		color: var(--color-neutral-50, #fafafa);
	}
	.ms-rail__subtitle {
		margin: 0.15rem 0 0;
		font-size: 0.8125rem;
		color: var(--color-neutral-500, #737373);
	}
	.ms-rail__controls {
		display: flex;
		gap: 0.4rem;
		flex-shrink: 0;
	}
	.ms-rail__viewport {
		position: relative;
	}
	.ms-rail__track {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(8.75rem, 9.75rem);
		gap: 1rem;
		overflow-x: auto;
		padding: 0.35rem 0.15rem 0.85rem;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
	}
	.ms-rail__track::-webkit-scrollbar {
		display: none;
	}
	.ms-rail__track--wide {
		grid-auto-columns: minmax(17rem, 19rem);
	}
	.ms-rail__track > :global(*) {
		scroll-snap-align: start;
	}
	.ms-rail__fade {
		pointer-events: none;
		position: absolute;
		top: 0;
		bottom: 0.85rem;
		width: 0.85rem;
		z-index: 1;
		opacity: 0.55;
	}
	.ms-rail__fade--left {
		left: 0;
		background: linear-gradient(90deg, var(--store-bg, #fafafa), transparent);
	}
	.ms-rail__fade--right {
		right: 0;
		background: linear-gradient(270deg, var(--store-bg, #fafafa), transparent);
	}
	:global(.dark) .ms-rail__fade--left {
		background: linear-gradient(90deg, var(--store-bg-dark, #0a0a0a), transparent);
	}
	:global(.dark) .ms-rail__fade--right {
		background: linear-gradient(270deg, var(--store-bg-dark, #0a0a0a), transparent);
	}
</style>
