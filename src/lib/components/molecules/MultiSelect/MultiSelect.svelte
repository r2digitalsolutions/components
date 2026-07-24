<script lang="ts">
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';

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

	let rootEl = $state<HTMLDivElement | null>(null);
	let search = $state('');
	let highlighted = $state(0);

	const selectedSet = $derived(new Set(value));
	const selectedOptions = $derived(options.filter((o) => selectedSet.has(o.value)));

	const filtered = $derived.by(() => {
		const q = search.trim().toLowerCase();
		if (!q) return options;
		return options.filter((o) => o.label.toLowerCase().includes(q));
	});

	const atMax = $derived(max !== undefined && value.length >= max);

	function setOpen(next: boolean) {
		if (disabled) return;
		open = next;
		if (next) {
			highlighted = 0;
			search = '';
		}
	}

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

	function onDocPointerDown(e: PointerEvent) {
		if (!open || !rootEl) return;
		const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
		if (path.includes(rootEl) || rootEl.contains(e.target as Node)) return;
		setOpen(false);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) setOpen(false);
	}

	function onListKeydown(e: KeyboardEvent) {
		const enabled = filtered.filter((o) => !o.disabled);
		if (!enabled.length) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			highlighted = (highlighted + 1) % filtered.length;
			while (filtered[highlighted]?.disabled) {
				highlighted = (highlighted + 1) % filtered.length;
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlighted = (highlighted - 1 + filtered.length) % filtered.length;
			while (filtered[highlighted]?.disabled) {
				highlighted = (highlighted - 1 + filtered.length) % filtered.length;
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const opt = filtered[highlighted];
			if (opt) toggle(opt);
		}
	}
</script>

<svelte:document onpointerdown={onDocPointerDown} onkeydown={onKey} />

<div class={['relative w-full max-w-md', className]} bind:this={rootEl}>
	{#if label}
		<span class="mb-1.5 block text-sm font-medium text-primary">{label}</span>
	{/if}

	<div
		class={[
			'flex min-h-10 w-full items-center gap-1.5 rounded-xl border border-border bg-surface-elevated px-2 py-1.5 transition-colors',
			open && 'border-brand-500 ring-2 ring-brand-500/20',
			disabled && 'opacity-60'
		]}
	>
		<button
			type="button"
			{disabled}
			onclick={() => setOpen(!open)}
			aria-expanded={open}
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

	{#if open}
		<div
			role="listbox"
			aria-multiselectable="true"
			class="absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-xl"
			onkeydown={onListKeydown}
		>
			{#if searchable}
				<div class="border-b border-border p-2">
					<input
						bind:value={search}
						placeholder="Search…"
						oninput={() => (highlighted = 0)}
						onkeydown={onListKeydown}
						class="w-full rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-xs text-primary outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
					/>
				</div>
			{/if}
			<div class="max-h-52 overflow-y-auto p-1.5">
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
				<div class="border-t border-border px-3 py-2 text-[11px] text-muted">
					{value.length} / {max} selected
				</div>
			{/if}
		</div>
	{/if}
</div>
