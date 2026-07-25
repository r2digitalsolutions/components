<script lang="ts">
	import type { Snippet } from 'svelte';

	export type MarqueeSeparator = 'dot' | 'bullet' | 'dash' | 'pipe' | 'none';

	interface MarqueeProps {
		/** Seconds for one full loop */
		speed?: number;
		direction?: 'left' | 'right';
		pauseOnHover?: boolean;
		/** Soft fade on the edges */
		fade?: boolean;
		gap?: 'sm' | 'md' | 'lg';
		/**
		 * Built-in separators between items.
		 * Use with `items`, or pass custom mark via `separatorMark`.
		 */
		separator?: MarqueeSeparator;
		/** Custom separator text (overrides `separator` glyph when set) */
		separatorMark?: string;
		/** Simple text items — separators are injected automatically */
		items?: string[];
		/** Pause when the OS asks for reduced motion */
		respectReducedMotion?: boolean;
		class?: string;
		children?: Snippet;
		/** Custom separator snippet (wins over separator / separatorMark) */
		separatorSlot?: Snippet;
	}

	let {
		speed = 28,
		direction = 'left',
		pauseOnHover = true,
		fade = true,
		gap = 'md',
		separator = 'dot',
		separatorMark,
		items,
		respectReducedMotion = true,
		class: className = '',
		children,
		separatorSlot
	}: MarqueeProps = $props();

	const gapClass = $derived(
		gap === 'sm' ? 'gap-4' : gap === 'lg' ? 'gap-12' : 'gap-8'
	);

	const marks: Record<Exclude<MarqueeSeparator, 'none'>, string> = {
		dot: '•',
		bullet: '●',
		dash: '—',
		pipe: '|'
	};

	const mark = $derived(
		separatorMark ?? (separator !== 'none' ? marks[separator] : '')
	);

	const showSeparator = $derived(
		!!separatorSlot || (separator !== 'none' && mark.length > 0)
	);
</script>

{#snippet sep()}
	{#if separatorSlot}
		<span class="inline-flex shrink-0 items-center text-muted" aria-hidden="true">
			{@render separatorSlot()}
		</span>
	{:else if showSeparator}
		<span
			class="inline-flex shrink-0 select-none items-center px-0.5 text-muted"
			aria-hidden="true"
		>
			<span class="text-sm leading-none opacity-60">{mark}</span>
		</span>
	{/if}
{/snippet}

{#snippet segment()}
	{#if items?.length}
		{#each items as item (item)}
			<span class="shrink-0 text-sm font-medium text-primary">{item}</span>
			{@render sep()}
		{/each}
	{:else if children}
		{@render children()}
	{/if}
{/snippet}

<div
	class={[
		'marquee relative overflow-hidden',
		fade &&
			'[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]',
		className
	]}
	role="marquee"
	aria-label="Scrolling content"
>
	<div
		class={[
			'marquee-track flex w-max',
			direction === 'right' && 'marquee-track--reverse',
			pauseOnHover && 'marquee-track--pause-hover',
			respectReducedMotion && 'marquee-track--respect-motion'
		]}
		style={`--marquee-duration: ${Math.max(speed, 4)}s`}
	>
		<div class={['flex shrink-0 items-center px-2', gapClass]}>
			{@render segment()}
		</div>
		<div class={['flex shrink-0 items-center px-2', gapClass]} aria-hidden="true">
			{@render segment()}
		</div>
	</div>
</div>

<style>
	@keyframes marquee-scroll {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(-50%, 0, 0);
		}
	}

	.marquee-track {
		animation: marquee-scroll var(--marquee-duration, 28s) linear infinite;
		will-change: transform;
	}

	.marquee-track--reverse {
		animation-direction: reverse;
	}

	.marquee:hover .marquee-track--pause-hover {
		animation-play-state: paused;
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track--respect-motion {
			animation-play-state: paused;
		}
	}
</style>
