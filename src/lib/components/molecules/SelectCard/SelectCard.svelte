<script lang="ts">
	import type { Snippet } from 'svelte';
	import SelectionBox from '$lib/components/atoms/SelectionBox/SelectionBox.svelte';
	import Check from '@lucide/svelte/icons/check';

	export type SelectCardLayout = 'media' | 'row';
	export type SelectCardCheck = 'box' | 'badge' | 'none';
	export type SelectCardTone = 'brand' | 'success' | 'error' | 'warning' | 'info';

	interface SelectCardProps {
		title?: string;
		description?: string;
		meta?: string;
		image?: string;
		imageAlt?: string;
		selected?: boolean;
		disabled?: boolean;
		/** media = grid tile · row = list row */
		layout?: SelectCardLayout;
		/** box = SelectionBox · badge = check pill · none = border only */
		check?: SelectCardCheck;
		/** Accent when selected (default brand) */
		tone?: SelectCardTone;
		class?: string;
		leading?: Snippet;
		children?: Snippet;
		trailing?: Snippet;
		onclick?: (e: MouseEvent) => void;
		onchange?: (selected: boolean) => void;
	}

	let {
		title,
		description,
		meta,
		image,
		imageAlt = '',
		selected = false,
		disabled = false,
		layout = 'media',
		check = 'box',
		tone = 'brand',
		class: className = '',
		leading,
		children,
		trailing,
		onclick,
		onchange
	}: SelectCardProps = $props();

	const selectedTone: Record<SelectCardTone, string> = {
		brand: 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20 dark:bg-brand-950/30',
		success:
			'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 dark:border-emerald-400 dark:bg-emerald-950/35',
		error: 'border-red-500 bg-red-50/70 ring-2 ring-red-500/20 dark:border-red-400 dark:bg-red-950/35',
		warning:
			'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 dark:border-amber-400 dark:bg-amber-950/35',
		info: 'border-sky-500 bg-sky-50/70 ring-2 ring-sky-500/20 dark:border-sky-400 dark:bg-sky-950/35'
	};

	const hoverTone: Record<SelectCardTone, string> = {
		brand: 'hover:border-brand-300 dark:hover:border-brand-700',
		success: 'hover:border-emerald-300 dark:hover:border-emerald-700',
		error: 'hover:border-red-300 dark:hover:border-red-700',
		warning: 'hover:border-amber-300 dark:hover:border-amber-700',
		info: 'hover:border-sky-300 dark:hover:border-sky-700'
	};

	const badgeTone: Record<SelectCardTone, string> = {
		brand: 'border-brand-500 bg-brand-500 text-white',
		success: 'border-emerald-500 bg-emerald-500 text-white',
		error: 'border-red-500 bg-red-500 text-white',
		warning: 'border-amber-500 bg-amber-500 text-white',
		info: 'border-sky-500 bg-sky-500 text-white'
	};

	const focusTone: Record<SelectCardTone, string> = {
		brand: 'focus-visible:ring-brand-500/30',
		success: 'focus-visible:ring-emerald-500/30',
		error: 'focus-visible:ring-red-500/30',
		warning: 'focus-visible:ring-amber-500/30',
		info: 'focus-visible:ring-sky-500/30'
	};

	const rootClass = $derived(
		[
			'group relative w-full text-left transition-all',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
			focusTone[tone],
			disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
			layout === 'media' && 'flex flex-col overflow-hidden rounded-xl border',
			layout === 'row' && 'flex items-center gap-3 rounded-xl border p-3',
			selected
				? selectedTone[tone]
				: ['border-border bg-surface-elevated', hoverTone[tone]].join(' '),
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
		onchange?.(!selected);
	}

	function handleCheck(checked: boolean) {
		if (disabled) return;
		onchange?.(checked);
	}
</script>

<button
	type="button"
	class={rootClass}
	{disabled}
	aria-pressed={selected}
	onclick={handleClick}
>
	{#if layout === 'media'}
		<div class="relative aspect-square w-full overflow-hidden bg-surface-overlay">
			{#if image}
				<img src={image} alt={imageAlt} class="h-full w-full object-cover" />
			{:else if leading}
				<div class="flex h-full w-full items-center justify-center">
					{@render leading()}
				</div>
			{:else}
				<div class="flex h-full w-full items-center justify-center text-muted" aria-hidden="true">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="h-8 w-8"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
			{/if}

			{#if check !== 'none'}
				<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
				<div class="absolute top-2 right-2" onclick={(e) => e.stopPropagation()}>
					{#if check === 'badge'}
						<span
							class={[
								'flex h-6 w-6 items-center justify-center rounded-full border shadow-sm transition-colors',
								selected
									? badgeTone[tone]
									: 'border-border bg-surface-elevated/90 text-transparent backdrop-blur-sm'
							]}
							aria-hidden="true"
						>
							<Check class="h-3.5 w-3.5" strokeWidth={2.5} />
						</span>
					{:else}
						<SelectionBox
							checked={selected}
							size="sm"
							{disabled}
							label={title ? `Select ${title}` : 'Select'}
							onchange={handleCheck}
						/>
					{/if}
				</div>
			{/if}
		</div>

		<div class="min-w-0 space-y-0.5 p-2.5">
			{#if children}
				{@render children()}
			{:else}
				{#if title}
					<p class="truncate text-xs font-medium text-primary">{title}</p>
				{/if}
				{#if description || meta}
					<p class="truncate text-[10px] text-muted">
						{#if description}{description}{/if}
						{#if description && meta} · {/if}
						{#if meta}{meta}{/if}
					</p>
				{/if}
			{/if}
		</div>
	{:else}
		{#if check === 'box'}
			<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
			<div class="shrink-0" onclick={(e) => e.stopPropagation()}>
				<SelectionBox
					checked={selected}
					size="md"
					{disabled}
					label={title ? `Select ${title}` : 'Select'}
					onchange={handleCheck}
				/>
			</div>
		{:else if check === 'badge'}
			<span
				class={[
					'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
					selected ? badgeTone[tone] : 'border-border-strong bg-surface text-transparent'
				]}
				aria-hidden="true"
			>
				<Check class="h-3 w-3" strokeWidth={2.5} />
			</span>
		{/if}

		{#if image || leading}
			<div class="shrink-0">
				{#if image}
					<img src={image} alt={imageAlt} class="h-11 w-11 rounded-lg object-cover" />
				{:else if leading}
					{@render leading()}
				{/if}
			</div>
		{/if}

		<div class="min-w-0 flex-1">
			{#if children}
				{@render children()}
			{:else}
				{#if title}
					<p class="truncate text-sm font-medium text-primary">{title}</p>
				{/if}
				{#if description}
					<p class="mt-0.5 truncate text-xs text-muted">{description}</p>
				{/if}
			{/if}
		</div>

		{#if meta}
			<span class="shrink-0 text-[11px] tabular-nums text-muted">{meta}</span>
		{/if}

		{#if trailing}
			<div class="shrink-0">{@render trailing()}</div>
		{/if}
	{/if}
</button>
