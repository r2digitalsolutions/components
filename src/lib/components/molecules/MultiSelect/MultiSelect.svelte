<script lang="ts">
	import { on } from 'svelte/events';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import { createId } from '$lib/utils/id.js';

	export interface MultiSelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface MultiSelectProps {
		options?: MultiSelectOption[];
		value?: string[];
		open?: boolean;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		searchable?: boolean;
		max?: number;
		emptyText?: string;
		class?: string;
		onchange?: (value: string[]) => void;
	}

	let {
		options = [],
		value = $bindable<string[]>([]),
		open = $bindable(false),
		label = '',
		placeholder = 'Select…',
		disabled = false,
		searchable = true,
		max,
		emptyText = 'No options found',
		class: className = '',
		onchange
	}: MultiSelectProps = $props();

	let triggerEl = $state<HTMLDivElement | null>(null);
	let listboxEl = $state<HTMLDivElement | null>(null);
	let searchInputEl = $state<HTMLInputElement | null>(null);
	let listboxStyle = $state('');
	let search = $state('');
	let highlighted = $state(0);

	let autoId = $state<string | undefined>(undefined);
	$effect(() => {
		autoId ??= createId('multiselect');
	});
	const listboxId = $derived(autoId ? `${autoId}-listbox` : undefined);

	const selectedSet = $derived(new Set(value));
	const selectedOptions = $derived(options.filter((o) => selectedSet.has(o.value)));

	const filtered = $derived.by(() => {
		const q = search.trim().toLowerCase();
		if (!q) return options;
		return options.filter((o) => o.label.toLowerCase().includes(q));
	});

	const atMax = $derived(max !== undefined && value.length >= max);

	function positionListbox() {
		if (!triggerEl) return;

		const rect = triggerEl.getBoundingClientRect();
		const gap = 6;
		const maxHeight = 256;
		const spaceBelow = window.innerHeight - rect.bottom - gap;
		const spaceAbove = rect.top - gap;
		const openUp = spaceBelow < Math.min(maxHeight, 160) && spaceAbove > spaceBelow;
		const available = Math.max(120, openUp ? spaceAbove : spaceBelow);

		listboxStyle = [
			`top: ${openUp ? 'auto' : `${rect.bottom + gap}px`}`,
			`bottom: ${openUp ? `${window.innerHeight - rect.top + gap}px` : 'auto'}`,
			`left: ${rect.left}px`,
			`width: ${rect.width}px`,
			`min-width: ${rect.width}px`,
			`max-height: ${Math.min(maxHeight, available)}px`
		].join('; ');
	}

	function openListbox() {
		if (disabled || !listboxEl) return;
		positionListbox();
		if (!listboxEl.matches(':popover-open')) listboxEl.showPopover();
	}

	function closeListbox() {
		if (listboxEl?.matches(':popover-open')) listboxEl.hidePopover();
	}

	function handleBeforeToggle(event: ToggleEvent) {
		if (event.newState === 'open') {
			if (disabled) {
				event.preventDefault();
				return;
			}
			search = '';
			highlighted = 0;
			positionListbox();
		}
	}

	function handleToggle(event: ToggleEvent) {
		open = event.newState === 'open';

		if (open) {
			requestAnimationFrame(() => {
				if (searchable) searchInputEl?.focus();
				else listboxEl?.focus();
			});
		} else {
			search = '';
			highlighted = 0;
		}
	}

	/** Keep bindable `open` in sync with the native popover. */
	$effect(() => {
		if (!listboxEl) return;
		const shouldOpen = open && !disabled;
		const isPopoverOpen = listboxEl.matches(':popover-open');
		if (shouldOpen && !isPopoverOpen) {
			positionListbox();
			listboxEl.showPopover();
		} else if (!shouldOpen && isPopoverOpen) {
			listboxEl.hidePopover();
		}
	});

	function emit(next: string[]) {
		value = next;
		onchange?.(next);
	}

	function toggle(option: MultiSelectOption) {
		if (option.disabled) return;
		if (selectedSet.has(option.value)) {
			emit(value.filter((v) => v !== option.value));
			return;
		}
		if (atMax) return;
		emit([...value, option.value]);
	}

	function remove(v: string) {
		emit(value.filter((x) => x !== v));
	}

	function clear(e: MouseEvent) {
		e.stopPropagation();
		if (disabled) return;
		emit([]);
	}

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (disabled) return;

		switch (e.key) {
			case 'ArrowDown':
			case 'ArrowUp':
				e.preventDefault();
				if (!open) openListbox();
				else onListKeydown(e);
				break;
			case 'Enter':
			case ' ':
				if (open) {
					e.preventDefault();
					const opt = filtered[highlighted];
					if (opt) toggle(opt);
				}
				break;
			case 'Escape':
				if (open) {
					e.preventDefault();
					closeListbox();
				}
				break;
		}
	}

	function onListKeydown(e: KeyboardEvent) {
		const enabled = filtered.filter((o) => !o.disabled);
		if (!enabled.length && e.key !== 'Escape' && e.key !== 'Tab') return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			e.stopPropagation();
			if (!filtered.length) return;
			highlighted = (highlighted + 1) % filtered.length;
			while (filtered[highlighted]?.disabled) {
				highlighted = (highlighted + 1) % filtered.length;
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			e.stopPropagation();
			if (!filtered.length) return;
			highlighted = (highlighted - 1 + filtered.length) % filtered.length;
			while (filtered[highlighted]?.disabled) {
				highlighted = (highlighted - 1 + filtered.length) % filtered.length;
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			const opt = filtered[highlighted];
			if (opt) toggle(opt);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			e.stopPropagation();
			closeListbox();
		} else if (e.key === 'Tab') {
			closeListbox();
		}
	}

	/** Prevent options from stealing focus from the search input */
	function handleOptionPointerDown(event: PointerEvent) {
		event.preventDefault();
	}

	$effect(() => {
		if (!open) return;

		const reposition = (event?: Event) => {
			const target = event?.target;
			if (target instanceof Node && listboxEl?.contains(target)) return;
			positionListbox();
		};

		const offResize = on(window, 'resize', reposition);
		const offScroll = on(window, 'scroll', reposition, { capture: true });

		return () => {
			offResize();
			offScroll();
		};
	});
</script>

<div class={['relative w-full max-w-md', className]}>
	{#if label}
		<span class="mb-1.5 block text-sm font-medium text-primary">{label}</span>
	{/if}

	<div
		bind:this={triggerEl}
		class={[
			'flex min-h-10 w-full items-center gap-1.5 rounded-xl border border-border bg-surface-elevated px-2 py-1.5 transition-colors',
			open && 'border-brand-500 ring-2 ring-brand-500/20',
			disabled && 'opacity-60'
		]}
	>
		<button
			type="button"
			{disabled}
			popovertarget={listboxId}
			popovertargetaction="toggle"
			onkeydown={handleTriggerKeydown}
			aria-expanded={open}
			aria-haspopup="listbox"
			aria-controls={listboxId}
			class={[
				'flex min-w-0 flex-1 flex-wrap items-center gap-1.5 text-left',
				'focus-visible:outline-none',
				disabled && 'cursor-not-allowed'
			]}
		>
			{#if selectedOptions.length === 0}
				<span class="px-1.5 text-sm text-muted">{placeholder}</span>
			{:else}
				{#each selectedOptions as opt (opt.value)}
					<Chip
						size="sm"
						variant="primary"
						dismissible={!disabled}
						ondismiss={() => remove(opt.value)}
					>
						{opt.label}
					</Chip>
				{/each}
			{/if}
		</button>
		{#if value.length > 0 && !disabled}
			<button
				type="button"
				onclick={clear}
				class="shrink-0 px-1.5 text-muted hover:text-primary"
				aria-label="Clear all"
			>
				<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
		<svg
			class={['h-4 w-4 shrink-0 text-muted transition-transform', open && 'rotate-180']}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	</div>

	<!-- Popover listbox (top layer + light dismiss). Stays open while toggling options. -->
	<div
		bind:this={listboxEl}
		id={listboxId}
		popover="auto"
		onbeforetoggle={handleBeforeToggle}
		ontoggle={handleToggle}
		onkeydown={onListKeydown}
		role="listbox"
		tabindex={-1}
		aria-multiselectable="true"
		aria-label={label || placeholder}
		style={listboxStyle}
		class={[
			'multiselect-listbox m-0 p-0 inset-auto overflow-hidden',
			'bg-surface-elevated border-border rounded-xl shadow-xl border',
			'flex flex-col outline-none'
		]}
	>
		{#if searchable}
			<div class="border-b border-border p-2 shrink-0">
				<input
					bind:this={searchInputEl}
					bind:value={search}
					type="text"
					placeholder="Search…"
					oninput={() => (highlighted = 0)}
					onkeydown={onListKeydown}
					class="w-full rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-xs text-primary outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
					role="searchbox"
					aria-controls={listboxId}
					aria-autocomplete="list"
				/>
			</div>
		{/if}
		<div class="min-h-0 flex-1 overflow-y-auto p-1.5">
			{#if filtered.length === 0}
				<div class="px-3 py-2.5 text-center text-xs text-muted">{emptyText}</div>
			{:else}
				{#each filtered as option, index (option.value)}
					{@const isSelected = selectedSet.has(option.value)}
					{@const blocked = !isSelected && atMax}
					<button
						type="button"
						role="option"
						disabled={option.disabled || blocked}
						aria-selected={isSelected}
						onpointerdown={handleOptionPointerDown}
						onpointerenter={() => {
							if (!option.disabled) highlighted = index;
						}}
						onclick={() => toggle(option)}
						class={[
							'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
							(option.disabled || blocked) && 'cursor-not-allowed opacity-40',
							!option.disabled &&
								!blocked &&
								(highlighted === index || isSelected
									? 'bg-brand-500 text-white'
									: 'text-primary hover:bg-surface-overlay')
						]}
					>
						<span
							class={[
								'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
								isSelected
									? highlighted === index || isSelected
										? 'border-white bg-white'
										: 'border-brand-500 bg-brand-500'
									: highlighted === index
										? 'border-white/60'
										: 'border-border-strong'
							]}
							aria-hidden="true"
						>
							{#if isSelected}
								<svg
									class="h-2.5 w-2.5 text-brand-600"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							{/if}
						</span>
						<span class="min-w-0 flex-1 truncate">{option.label}</span>
					</button>
				{/each}
			{/if}
		</div>
		{#if max !== undefined}
			<div class="border-t border-border px-3 py-2 text-[11px] text-muted shrink-0">
				{value.length} / {max} selected
			</div>
		{/if}
	</div>
</div>

<style>
	.multiselect-listbox {
		position: fixed;
	}

	.multiselect-listbox:popover-open {
		display: flex;
	}

	/* Reset UA popover centering */
	.multiselect-listbox:not(:popover-open) {
		display: none;
	}
</style>
