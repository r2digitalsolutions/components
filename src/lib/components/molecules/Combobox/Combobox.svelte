<script lang="ts">
	import type { Snippet } from 'svelte';
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
	let inputEl = $state<HTMLInputElement | null>(null);
	let highlighted = $state(0);
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

	function setOpen(next: boolean) {
		if (disabled) return;
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

	function onDocPointerDown(e: PointerEvent) {
		if (!open || !rootEl) return;
		const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
		if (path.includes(rootEl) || rootEl.contains(e.target as Node)) return;
		setOpen(false);
		if (selected) query = selected.label;
		else if (!creatable) query = '';
	}

	$effect(() => {
		if (selected && !open && query !== selected.label) {
			query = selected.label;
		}
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

<svelte:document onpointerdown={onDocPointerDown} />

<div class={['max-w-sm relative w-full', className]} bind:this={rootEl}>
	{#if label}
		<span class="mb-1.5 text-sm font-medium text-primary block">{label}</span>
	{/if}

	<div
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

	{#if open}
		<div
			id={listboxId}
			role="listbox"
			class="left-0 right-0 mt-2 max-h-60 rounded-xl border-border bg-surface-elevated p-1.5 shadow-xl absolute z-50 overflow-y-auto border"
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
	{/if}
</div>
