<script lang="ts">
	import type { Snippet } from 'svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	export type TileAccent =
		| 'none'
		| 'brand'
		| 'neutral'
		| 'success'
		| 'warning'
		| 'danger'
		| 'info';

	export type TileVariant = 'card' | 'flush' | 'plain';
	export type TileSize = 'sm' | 'md' | 'lg';

	interface TileProps {
		title?: string;
		/** Alias friendly — same as subtitle */
		description?: string;
		subtitle?: string;
		meta?: string;
		/** Left edge accent bar */
		accent?: TileAccent;
		variant?: TileVariant;
		size?: TileSize;
		dense?: boolean;
		selected?: boolean;
		disabled?: boolean;
		/** Show chevron when clickable */
		chevron?: boolean;
		href?: string;
		class?: string;
		leading?: Snippet;
		/** Right side content (Flutter trailing) */
		trailing?: Snippet;
		/** Custom body — replaces title/subtitle block when set */
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		title,
		description,
		subtitle,
		meta,
		accent = 'none',
		variant = 'card',
		size = 'md',
		dense = false,
		selected = false,
		disabled = false,
		chevron,
		href,
		class: className = '',
		leading,
		trailing,
		children,
		onclick
	}: TileProps = $props();

	const subtitleText = $derived(subtitle ?? description);
	const clickable = $derived(!!onclick || !!href);
	const showChevron = $derived(chevron ?? clickable);

	const accentClass: Record<Exclude<TileAccent, 'none'>, string> = {
		brand: 'bg-brand-500',
		neutral: 'bg-border-strong',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		danger: 'bg-red-500',
		info: 'bg-sky-500'
	};

	const padY: Record<TileSize, string> = {
		sm: dense ? 'py-1.5' : 'py-2',
		md: dense ? 'py-2' : 'py-2.5',
		lg: dense ? 'py-2.5' : 'py-3'
	};

	const padX = $derived.by(() => {
		const right = size === 'sm' ? 'pr-2.5' : size === 'lg' ? 'pr-3.5' : 'pr-3';
		if (accent === 'none') {
			const left = size === 'sm' ? 'pl-2.5' : size === 'lg' ? 'pl-3.5' : 'pl-3';
			return `${left} ${right}`;
		}
		const left = size === 'sm' ? 'pl-3.5' : size === 'lg' ? 'pl-4' : 'pl-3.5';
		return `${left} ${right}`;
	});

	const titleSize: Record<TileSize, string> = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-sm'
	};

	const subSize: Record<TileSize, string> = {
		sm: 'text-[10px]',
		md: 'text-xs',
		lg: 'text-xs'
	};

	const rootClass = $derived(
		[
			'group relative flex w-full min-w-0 items-center gap-2.5 text-left transition-colors',
			padY[size],
			padX,
			variant === 'card' &&
				'overflow-hidden rounded-xl border border-border bg-surface-elevated',
			variant === 'plain' && 'rounded-lg',
			selected &&
				(variant === 'card'
					? 'border-brand-500/40 bg-brand-50/50 ring-1 ring-brand-500/15 dark:bg-brand-950/25'
					: 'bg-brand-50 dark:bg-brand-950/40'),
			clickable &&
				!disabled &&
				'cursor-pointer hover:bg-surface-overlay/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			variant === 'flush' &&
				clickable &&
				!disabled &&
				'focus-visible:ring-inset',
			variant === 'card' &&
				clickable &&
				!disabled &&
				'hover:border-border-strong',
			disabled && 'cursor-not-allowed opacity-50',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	function handleClick(e: MouseEvent) {
		if (disabled) {
			e.preventDefault();
			return;
		}
		onclick?.(e);
	}
</script>

{#snippet body()}
	{#if accent !== 'none'}
		<span
			class={[
				'pointer-events-none absolute left-0 w-0.5',
				variant === 'flush' ? 'inset-y-0' : 'top-2 bottom-2 rounded-r-full',
				accentClass[accent]
			]}
			aria-hidden="true"
		></span>
	{/if}

	{#if leading}
		<div class="shrink-0">{@render leading()}</div>
	{/if}

	<div class="min-w-0 flex-1">
		{#if children}
			{@render children()}
		{:else}
			{#if title}
				<p class={['truncate font-medium leading-tight text-primary', titleSize[size]]}>
					{title}
				</p>
			{/if}
			{#if subtitleText}
				<p class={['mt-0.5 truncate leading-tight text-muted', subSize[size]]}>
					{subtitleText}
				</p>
			{/if}
		{/if}
	</div>

	{#if meta || trailing || showChevron}
		<div class="flex shrink-0 items-center gap-1.5">
			{#if meta}
				<span class={['tabular-nums text-muted', subSize[size]]}>{meta}</span>
			{/if}
			{#if trailing}
				{@render trailing()}
			{/if}
			{#if showChevron}
				<ChevronRight
					class="h-3.5 w-3.5 text-muted opacity-60 transition-opacity group-hover:opacity-100"
					strokeWidth={2}
					aria-hidden="true"
				/>
			{/if}
		</div>
	{/if}
{/snippet}

{#if href && !disabled}
	<a {href} class={rootClass} onclick={handleClick}>
		{@render body()}
	</a>
{:else if clickable}
	<button type="button" class={rootClass} {disabled} onclick={handleClick}>
		{@render body()}
	</button>
{:else}
	<div class={rootClass} aria-disabled={disabled || undefined}>
		{@render body()}
	</div>
{/if}
