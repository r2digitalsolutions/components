<script lang="ts">
	export interface ComboboxOption {
		value: string;
		label: string;
		disabled?: boolean;
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
		onchange,
		oncreate
	}: ComboboxProps = $props();

	let rootEl = $state<HTMLDivElement | null>(null);
	let inputEl = $state<HTMLInputElement | null>(null);
	let highlighted = $state(0);

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
		const list: Array<{ kind: 'option'; option: ComboboxOption } | { kind: 'create'; label: string }> =
			filtered.map((option) => ({ kind: 'option' as const, option }));
		if (canCreate) list.push({ kind: 'create', label: createText(query.trim()) });
		return list;
	});

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
			else if (items.length) highlighted = (highlighted + 1) % items.length;
			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (!open) setOpen(true);
			else if (items.length) highlighted = (highlighted - 1 + items.length) % items.length;
			return;
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			const item = items[highlighted];
			if (!item) return;
			if (item.kind === 'create') createOption();
			else selectOption(item.option);
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
</script>

<svelte:document onpointerdown={onDocPointerDown} />

<div class={['relative w-full max-w-sm', className]} bind:this={rootEl}>
	{#if label}
		<span class="mb-1.5 block text-sm font-medium text-primary">{label}</span>
	{/if}

	<div
		class={[
			'flex h-10 items-center gap-2 rounded-xl border border-border bg-surface-elevated px-3 transition-colors',
			open && 'border-brand-500 ring-2 ring-brand-500/20',
			disabled && 'cursor-not-allowed opacity-60'
		]}
	>
		<svg
			class="h-4 w-4 shrink-0 text-muted"
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
			aria-autocomplete="list"
			autocomplete="off"
			oninput={onInput}
			onfocus={onFocus}
			onkeydown={onKeydown}
			class="min-w-0 flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-muted"
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
				<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</div>

	{#if open}
		<div
			role="listbox"
			class="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-border bg-surface-elevated p-1.5 shadow-xl"
		>
			{#if items.length === 0}
				<div class="px-3 py-2.5 text-center text-xs text-muted">{emptyText}</div>
			{:else}
				{#each items as item, index (item.kind === 'option' ? item.option.value : 'create')}
					{#if item.kind === 'create'}
						<button
							type="button"
							role="option"
							aria-selected={highlighted === index}
							onpointerenter={() => (highlighted = index)}
							onclick={createOption}
							class={[
								'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm',
								highlighted === index ? 'bg-brand-500 text-white' : 'text-primary hover:bg-surface-overlay'
							]}
						>
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
							{item.label}
						</button>
					{:else}
						{@const option = item.option}
						{@const isSelected = value === option.value}
						<button
							type="button"
							role="option"
							disabled={option.disabled}
							aria-selected={isSelected}
							onpointerenter={() => {
								if (!option.disabled) highlighted = index;
							}}
							onclick={() => selectOption(option)}
							class={[
								'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm',
								option.disabled && 'cursor-not-allowed opacity-40',
								!option.disabled &&
									(highlighted === index || isSelected
										? 'bg-brand-500 text-white'
										: 'text-primary hover:bg-surface-overlay')
							]}
						>
							<span class="min-w-0 flex-1 truncate">{option.label}</span>
							{#if isSelected}
								<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							{/if}
						</button>
					{/if}
				{/each}
			{/if}
		</div>
	{/if}
</div>
