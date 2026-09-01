<script lang="ts">
	import type { Snippet } from 'svelte';
	import { on } from 'svelte/events';
	import ComboboxItem from '$lib/components/molecules/ComboboxItem/ComboboxItem.svelte';
	import {
		COMBOBOX_CREATE_KEY,
		setComboboxContext,
		type ComboboxContext
	} from './combobox-context.js';

	export interface ComboboxOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	export interface ComboboxItemState {
		selected: boolean;
		highlighted: boolean;
		index: number;
	}

	interface ComboboxProps {
		options?: ComboboxOption[];
		value?: string;
		/** Free-text query shown in the input (defaults to selected label). */
		query?: string;
		open?: boolean;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		/** Allow values not in `options`. */
		creatable?: boolean;
		emptyText?: string;
		createText?: (query: string) => string;
		class?: string;
		/**
		 * Custom row for each `options` entry. If omitted, rows use `ComboboxItem`.
		 */
		item?: Snippet<[ComboboxOption, ComboboxItemState]>;
		/**
		 * Extra (or fully custom) `ComboboxItem` rows rendered in the listbox.
		 * Nested items register for keyboard nav and filter against `query`.
		 */
		children?: Snippet;
		onchange?: (value: string) => void;
		oncreate?: (value: string) => void;
	}

	let {
		options = [],
		value = $bindable(''),
		query = $bindable(''),
		open = $bindable(false),
		label = '',
		placeholder = 'Search…',
		disabled = false,
		creatable = false,
		emptyText = 'No results',
		createText = (q) => `Create “${q}”`,
		class: className = '',
		item: itemSnippet,
		children,
		onchange,
		oncreate
	}: ComboboxProps = $props();

	let rootEl = $state<HTMLDivElement | null>(null);
	let triggerEl = $state<HTMLDivElement | null>(null);
	let popoverEl = $state<HTMLDivElement | null>(null);
	let inputEl = $state<HTMLInputElement | null>(null);
	let highlighted = $state(0);
	let openingGesture = $state(false);
	let childEntries = $state<{ id: number; value: string; disabled: boolean; label: string }[]>([]);
	let nextChildId = 0;
	const uid = $props.id();
	const listboxId = `${uid}-listbox`;

	const selected = $derived(options.find((o) => o.value === value));

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return options;
		return options.filter(
			(o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
		);
	});

	const canCreate = $derived.by(() => {
		if (!creatable) return false;
		const q = query.trim();
		if (!q) return false;
		return !options.some((o) => o.label.toLowerCase() === q.toLowerCase() || o.value === q);
	});

	const items = $derived.by(() => {
		const list: Array<
			{ kind: 'option'; option: ComboboxOption } | { kind: 'create'; label: string }
		> = filtered.map((option) => ({ kind: 'option' as const, option }));
		if (canCreate) list.push({ kind: 'create', label: createText(query.trim()) });
		return list;
	});

	function itemKey(
		item: { kind: 'option'; option: ComboboxOption } | { kind: 'create'; label: string }
	): string {
		return item.kind === 'create' ? COMBOBOX_CREATE_KEY : item.option.value;
	}

	const navKeys = $derived.by(() => {
		const keys = items.map(itemKey);
		for (const entry of childEntries) {
			if (!entry.disabled && !keys.includes(entry.value)) keys.push(entry.value);
		}
		return keys;
	});

	const activeIndex = $derived(
		navKeys.length === 0 ? 0 : Math.min(highlighted, navKeys.length - 1)
	);
	const highlightedKey = $derived(navKeys[activeIndex] ?? null);
	const hasRows = $derived(items.length > 0 || childEntries.length > 0 || Boolean(children));

	function positionPopover(opts: { measure?: boolean } = {}) {
		if (!triggerEl || !popoverEl) return;
		if (!popoverEl.matches(':popover-open') && opts.measure !== false) return;

		const rect = triggerEl.getBoundingClientRect();
		if (rect.width < 2 && rect.height < 2) return;

		const gap = 8;
		const margin = 8;
		const maxH = 240;
		const spaceBelow = window.innerHeight - rect.bottom - gap - margin;
		const spaceAbove = rect.top - gap - margin;
		const openUp = spaceBelow < 120 && spaceAbove > spaceBelow;
		const height = Math.min(maxH, Math.max(80, openUp ? spaceAbove : spaceBelow));

		const top = openUp ? undefined : rect.bottom + gap;
		const bottom = openUp ? window.innerHeight - rect.top + gap : undefined;

		const style = [
			'position:fixed',
			'margin:0',
			'inset:auto',
			`left:${Math.max(margin, Math.min(rect.left, window.innerWidth - rect.width - margin))}px`,
			`width:${rect.width}px`,
			top !== undefined ? `top:${top}px` : 'top:auto',
			bottom !== undefined ? `bottom:${bottom}px` : 'bottom:auto',
			`max-height:${height}px`
		].join(';');

		popoverEl.style.cssText = style;
	}

	function syncNative() {
		if (!popoverEl) return;
		const isOpen = popoverEl.matches(':popover-open');
		try {
			if (open && !isOpen) popoverEl.showPopover();
			else if (!open && isOpen) popoverEl.hidePopover();
		} catch {
			/* ignore */
		}
	}

	function onDocPointerDown(event: PointerEvent) {
		if (!open || openingGesture) return;
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (rootEl?.contains(target) || popoverEl?.contains(target)) return;
		setOpen(false);
	}

	function markOpeningGesture() {
		openingGesture = true;
		queueMicrotask(() => {
			openingGesture = false;
		});
	}

	function commitPendingQuery() {
		const trimmed = query.trim();
		if (!creatable || !trimmed || trimmed === value) return;
		value = trimmed;
		onchange?.(trimmed);
	}

	function onPopoverClose() {
		commitPendingQuery();
		if (selected) query = selected.label;
		else if (value) query = value;
		else if (!creatable) query = '';
	}

	function handleBeforeToggle(event: ToggleEvent) {
		if (event.newState === 'open' && disabled) {
			event.preventDefault();
			return;
		}
		if (event.newState === 'open') {
			positionPopover({ measure: false });
		}
	}

	function handleToggle(event: ToggleEvent) {
		const next = event.newState === 'open';
		open = next;
		if (next) {
			highlighted = 0;
			queueMicrotask(() => {
				positionPopover();
				requestAnimationFrame(() => positionPopover());
			});
		} else {
			onPopoverClose();
		}
	}

	function setOpen(next: boolean) {
		if (disabled) return;
		if (next) markOpeningGesture();
		open = next;
		if (next) {
			highlighted = 0;
			queueMicrotask(() => inputEl?.focus());
		}
	}

	function selectOption(option: ComboboxOption) {
		if (option.disabled) return;
		value = option.value;
		query = option.label;
		onchange?.(option.value);
		setOpen(false);
	}

	function createOption() {
		const next = query.trim();
		if (!next) return;
		value = next;
		onchange?.(next);
		oncreate?.(next);
		setOpen(false);
	}

	function selectByKey(key: string) {
		if (key === COMBOBOX_CREATE_KEY) {
			createOption();
			return;
		}
		const option = options.find((o) => o.value === key);
		if (option) {
			selectOption(option);
			return;
		}
		const child = childEntries.find((entry) => entry.value === key);
		value = key;
		query = child?.label || key;
		onchange?.(key);
		setOpen(false);
	}

	function highlightByKey(key: string) {
		const index = navKeys.indexOf(key);
		if (index >= 0) highlighted = index;
	}

	function onInput() {
		setOpen(true);
		highlighted = 0;
		if (!query && value) {
			value = '';
			onchange?.('');
		}
	}

	function onFocus() {
		if (!query && selected) query = selected.label;
		setOpen(true);
	}

	function onKeydown(e: KeyboardEvent) {
		if (disabled) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!open) setOpen(true);
			else if (navKeys.length) highlighted = (activeIndex + 1) % navKeys.length;
			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (!open) setOpen(true);
			else if (navKeys.length) highlighted = (activeIndex - 1 + navKeys.length) % navKeys.length;
			return;
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			const key = navKeys[activeIndex];
			if (!key) return;
			selectByKey(key);
			return;
		}
		if (e.key === 'Escape') {
			setOpen(false);
			return;
		}
	}

	$effect(() => {
		if (open) return;
		if (selected && query !== selected.label) {
			query = selected.label;
		} else if (value && query !== value) {
			query = value;
		}
	});

	$effect(() => {
		open;
		queueMicrotask(() => {
			syncNative();
			if (open) positionPopover();
		});
	});

	$effect(() => {
		if (!open) return;

		let frame = 0;
		const reposition = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => positionPopover());
		};

		const offScroll = on(window, 'scroll', reposition, { capture: true, passive: true });
		const offResize = on(window, 'resize', reposition);
		// Defer past the opening click — same gesture must not count as outside.
		const timer = window.setTimeout(() => {
			document.addEventListener('pointerdown', onDocPointerDown, true);
		}, 0);

		return () => {
			cancelAnimationFrame(frame);
			offScroll();
			offResize();
			window.clearTimeout(timer);
			document.removeEventListener('pointerdown', onDocPointerDown, true);
		};
	});

	const ctx: ComboboxContext = {
		getValue: () => value,
		getQuery: () => query,
		getHighlighted: () => highlightedKey,
		select: selectByKey,
		highlight: highlightByKey,
		register: (childValue, childDisabled, childLabel = '') => {
			const id = ++nextChildId;
			childEntries = [
				...childEntries,
				{ id, value: childValue, disabled: childDisabled, label: childLabel }
			];
			return () => {
				childEntries = childEntries.filter((entry) => entry.id !== id);
			};
		}
	};

	setComboboxContext(ctx);
</script>

<div class={['max-w-sm w-full', className]} bind:this={rootEl}>
	{#if label}
		<span class="mb-1.5 text-sm font-medium text-primary block">{label}</span>
	{/if}

	<div
		bind:this={triggerEl}
		class={[
			'h-10 gap-2 rounded-xl border-border bg-surface-elevated px-3 flex items-center border transition-colors',
			open && 'border-brand-500 ring-brand-500/20 ring-2',
			disabled && 'cursor-not-allowed opacity-60'
		]}
	>
		<svg
			class="h-4 w-4 text-muted shrink-0"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
			/>
		</svg>
		<input
			bind:this={inputEl}
			bind:value={query}
			{placeholder}
			{disabled}
			role="combobox"
			aria-expanded={open}
			aria-controls={listboxId}
			aria-autocomplete="list"
			autocomplete="off"
			oninput={onInput}
			onfocus={onFocus}
			onkeydown={onKeydown}
			class="min-w-0 text-sm text-primary placeholder:text-muted flex-1 bg-transparent outline-none"
		/>
		{#if query && !disabled}
			<button
				type="button"
				aria-label="Clear"
				onclick={() => {
					query = '';
					value = '';
					onchange?.('');
					inputEl?.focus();
					setOpen(true);
				}}
				class="text-muted hover:text-primary"
			>
				<svg
					class="h-3.5 w-3.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</div>

	<div
		bind:this={popoverEl}
		id={listboxId}
		popover="manual"
		role="listbox"
		onbeforetoggle={handleBeforeToggle}
		ontoggle={handleToggle}
		class="combobox-popover inset-auto m-0 overflow-y-auto rounded-xl border border-border bg-surface-elevated p-1.5 shadow-xl outline-none"
	>
		{#if !hasRows}
			<div class="px-3 py-2.5 text-xs text-muted text-center">{emptyText}</div>
		{:else}
			{#each items as item, index (itemKey(item))}
					{#if item.kind === 'create'}
						<ComboboxItem
							value={COMBOBOX_CREATE_KEY}
							label={item.label}
							highlighted={activeIndex === index}
							register={false}
							onclick={createOption}
						>
							{#snippet leading()}
								<svg
									class="h-4 w-4 shrink-0"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
								</svg>
							{/snippet}
							{item.label}
						</ComboboxItem>
					{:else}
						{@const option = item.option}
						{@const isSelected = value === option.value}
						{@const isHighlighted = activeIndex === index}
						{#if itemSnippet}
							{@render itemSnippet(option, {
								selected: isSelected,
								highlighted: isHighlighted,
								index
							})}
						{:else}
							<ComboboxItem
								value={option.value}
								label={option.label}
								disabled={option.disabled}
								selected={isSelected}
								highlighted={isHighlighted}
								register={false}
								onclick={() => selectOption(option)}
							/>
						{/if}
					{/if}
				{/each}
				{@render children?.()}
			{/if}
	</div>
</div>

<style>
	.combobox-popover {
		position: fixed;
	}

	.combobox-popover:popover-open {
		display: block;
	}

	.combobox-popover:not(:popover-open) {
		display: none;
	}
</style>
