<script lang="ts">
	export interface TransferOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface TransferListProps {
		options?: TransferOption[];
		value?: string[];
		leftTitle?: string;
		rightTitle?: string;
		searchable?: boolean;
		disabled?: boolean;
		class?: string;
		onchange?: (value: string[]) => void;
	}

	let {
		options = [],
		value = $bindable([]),
		leftTitle = 'Available',
		rightTitle = 'Selected',
		searchable = false,
		disabled = false,
		class: className = '',
		onchange
	}: TransferListProps = $props();

	let leftSearch = $state('');
	let rightSearch = $state('');
	let leftChecked = $state<Set<string>>(new Set());
	let rightChecked = $state<Set<string>>(new Set());

	const selectedSet = $derived(new Set(value));

	const leftItems = $derived(
		options.filter((o) => !selectedSet.has(o.value) && (!searchable || o.label.toLowerCase().includes(leftSearch.toLowerCase())))
	);

	const rightItems = $derived(
		options.filter((o) => selectedSet.has(o.value) && (!searchable || o.label.toLowerCase().includes(rightSearch.toLowerCase())))
	);

	function emit(next: string[]) {
		value = next;
		onchange?.(next);
	}

	function moveRight() {
		const toAdd = [...leftChecked].filter((v) => !selectedSet.has(v));
		emit([...value, ...toAdd]);
		leftChecked = new Set();
	}

	function moveLeft() {
		const toRemove = new Set(rightChecked);
		emit(value.filter((v) => !toRemove.has(v)));
		rightChecked = new Set();
	}

	function moveAllRight() {
		const allLeft = leftItems.filter((o) => !o.disabled).map((o) => o.value);
		emit([...value, ...allLeft.filter((v) => !selectedSet.has(v))]);
		leftChecked = new Set();
	}

	function moveAllLeft() {
		const allRight = new Set(rightItems.filter((o) => !o.disabled).map((o) => o.value));
		emit(value.filter((v) => !allRight.has(v)));
		rightChecked = new Set();
	}

	function toggleLeft(val: string) {
		leftChecked = new Set(leftChecked);
		if (leftChecked.has(val)) leftChecked.delete(val);
		else leftChecked.add(val);
	}

	function toggleRight(val: string) {
		rightChecked = new Set(rightChecked);
		if (rightChecked.has(val)) rightChecked.delete(val);
		else rightChecked.add(val);
	}
</script>

<div class={['flex items-stretch gap-3 w-full', className]}>
	<!-- Left panel -->
	<div class="flex flex-1 flex-col rounded-lg border border-border bg-surface-elevated overflow-hidden">
		<div class="flex items-center justify-between px-3 py-2 border-b border-border bg-surface-overlay">
			<span class="text-xs font-semibold text-secondary uppercase tracking-wide">{leftTitle}</span>
			<span class="text-xs text-muted">{leftItems.length}</span>
		</div>

		{#if searchable}
			<div class="px-2 py-1.5 border-b border-border">
				<input
					type="search"
					bind:value={leftSearch}
					placeholder="Search…"
					{disabled}
					class="w-full bg-transparent text-sm text-primary placeholder:text-muted outline-none px-1"
				/>
			</div>
		{/if}

		<ul class="flex-1 overflow-y-auto p-1 min-h-32 max-h-64" role="listbox" aria-multiselectable="true" aria-label={leftTitle}>
			{#each leftItems as option (option.value)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					role="option"
					aria-selected={leftChecked.has(option.value)}
					aria-disabled={option.disabled || disabled}
					onclick={() => !option.disabled && !disabled && toggleLeft(option.value)}
					class={[
						'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer select-none transition-colors',
						leftChecked.has(option.value) ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'text-primary hover:bg-surface-overlay',
						(option.disabled || disabled) && 'opacity-40 cursor-not-allowed'
					]}
				>
					<input
						type="checkbox"
						checked={leftChecked.has(option.value)}
						disabled={option.disabled || disabled}
						tabindex={-1}
						class="shrink-0 accent-brand-500"
						aria-hidden="true"
					/>
					<span class="truncate">{option.label}</span>
				</li>
			{:else}
				<li class="flex items-center justify-center h-20 text-xs text-muted">
					{searchable && leftSearch ? 'No matches' : 'Empty'}
				</li>
			{/each}
		</ul>
	</div>

	<!-- Controls -->
	<div class="flex flex-col items-center justify-center gap-1.5 py-2">
		{#each [
			{ label: '≫', title: 'Move all right', action: moveAllRight, disabled: leftItems.filter(o => !o.disabled).length === 0 || disabled },
			{ label: '›', title: 'Move selected right', action: moveRight, disabled: leftChecked.size === 0 || disabled },
			{ label: '‹', title: 'Move selected left', action: moveLeft, disabled: rightChecked.size === 0 || disabled },
			{ label: '≪', title: 'Move all left', action: moveAllLeft, disabled: rightItems.filter(o => !o.disabled).length === 0 || disabled }
		] as btn}
			<button
				type="button"
				title={btn.title}
				disabled={btn.disabled}
				onclick={btn.action}
				class="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-elevated text-sm font-bold text-secondary transition-colors hover:bg-surface-overlay hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
			>
				{btn.label}
			</button>
		{/each}
	</div>

	<!-- Right panel -->
	<div class="flex flex-1 flex-col rounded-lg border border-border bg-surface-elevated overflow-hidden">
		<div class="flex items-center justify-between px-3 py-2 border-b border-border bg-surface-overlay">
			<span class="text-xs font-semibold text-secondary uppercase tracking-wide">{rightTitle}</span>
			<span class="text-xs text-muted">{rightItems.length}</span>
		</div>

		{#if searchable}
			<div class="px-2 py-1.5 border-b border-border">
				<input
					type="search"
					bind:value={rightSearch}
					placeholder="Search…"
					{disabled}
					class="w-full bg-transparent text-sm text-primary placeholder:text-muted outline-none px-1"
				/>
			</div>
		{/if}

		<ul class="flex-1 overflow-y-auto p-1 min-h-32 max-h-64" role="listbox" aria-multiselectable="true" aria-label={rightTitle}>
			{#each rightItems as option (option.value)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					role="option"
					aria-selected={rightChecked.has(option.value)}
					aria-disabled={option.disabled || disabled}
					onclick={() => !option.disabled && !disabled && toggleRight(option.value)}
					class={[
						'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer select-none transition-colors',
						rightChecked.has(option.value) ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'text-primary hover:bg-surface-overlay',
						(option.disabled || disabled) && 'opacity-40 cursor-not-allowed'
					]}
				>
					<input
						type="checkbox"
						checked={rightChecked.has(option.value)}
						disabled={option.disabled || disabled}
						tabindex={-1}
						class="shrink-0 accent-brand-500"
						aria-hidden="true"
					/>
					<span class="truncate">{option.label}</span>
				</li>
			{:else}
				<li class="flex items-center justify-center h-20 text-xs text-muted">
					{searchable && rightSearch ? 'No matches' : 'Empty'}
				</li>
			{/each}
		</ul>
	</div>
</div>
