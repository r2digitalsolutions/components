<script lang="ts">
	type Panel = 'months' | 'years';

	interface MonthPickerProps {
		/** First day of selected month */
		value?: Date;
		locale?: string;
		minYear?: number;
		maxYear?: number;
		class?: string;
		onchange?: (date: Date) => void;
	}

	let {
		value = $bindable(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
		locale = 'en',
		minYear = new Date().getFullYear() - 80,
		maxYear = new Date().getFullYear() + 20,
		class: className = '',
		onchange
	}: MonthPickerProps = $props();

	let year = $state(value.getFullYear());
	let panel = $state<Panel>('months');
	let decadeAnchor = $state(Math.floor(value.getFullYear() / 12) * 12);

	$effect(() => {
		year = value.getFullYear();
	});

	const months = $derived(
		Array.from({ length: 12 }, (_, i) => ({
			index: i,
			label: new Date(2000, i, 1).toLocaleString(locale, { month: 'short' }),
			full: new Date(2000, i, 1).toLocaleString(locale, { month: 'long' })
		}))
	);

	const years = $derived(Array.from({ length: 12 }, (_, i) => decadeAnchor + i));
	const decadeLabel = $derived(`${decadeAnchor} – ${decadeAnchor + 11}`);

	const today = new Date();
	const selectedLabel = $derived(
		value.toLocaleString(locale, { month: 'long', year: 'numeric' })
	);

	function selectMonth(month: number) {
		value = new Date(year, month, 1);
		panel = 'months';
		onchange?.(value);
	}

	function selectYear(next: number) {
		if (next < minYear || next > maxYear) return;
		year = next;
		panel = 'months';
	}

	function isSelected(month: number) {
		return value.getFullYear() === year && value.getMonth() === month;
	}

	function isCurrent(month: number) {
		return today.getFullYear() === year && today.getMonth() === month;
	}

	function openYears() {
		decadeAnchor = Math.floor(year / 12) * 12;
		panel = 'years';
	}

	function shift(delta: number) {
		if (panel === 'years') {
			decadeAnchor += delta * 12;
			return;
		}
		year += delta;
	}

	function goThisMonth() {
		value = new Date(today.getFullYear(), today.getMonth(), 1);
		year = value.getFullYear();
		panel = 'months';
		onchange?.(value);
	}

	function gridButtonClass(selected: boolean, current: boolean, disabled = false) {
		return [
			'relative rounded-xl px-2 py-3 text-sm transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			disabled && 'cursor-not-allowed opacity-30',
			!disabled && selected && 'bg-brand-500 font-semibold text-white shadow-sm',
			!disabled &&
				!selected &&
				current &&
				'bg-brand-50 font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300',
			!disabled &&
				!selected &&
				!current &&
				'text-secondary hover:bg-surface-overlay hover:text-primary'
		];
	}
</script>

<div
	class={[
		'w-full max-w-[20rem] overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
>
	<div class="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
		<button
			type="button"
			class="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-overlay hover:text-primary"
			onclick={() => shift(-1)}
			aria-label={panel === 'years' ? 'Previous years' : 'Previous year'}
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		{#if panel === 'months'}
			<button
				type="button"
				class="rounded-md px-2 py-0.5 text-sm font-semibold tabular-nums text-primary transition-colors hover:bg-surface-overlay"
				onclick={openYears}
				aria-label="Choose year"
			>
				{year}
			</button>
		{:else}
			<span class="text-sm font-semibold tabular-nums text-primary">{decadeLabel}</span>
		{/if}

		<button
			type="button"
			class="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-overlay hover:text-primary"
			onclick={() => shift(1)}
			aria-label={panel === 'years' ? 'Next years' : 'Next year'}
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>

	<div class="p-3">
		{#if panel === 'months'}
			<div class="grid grid-cols-3 gap-2" role="listbox" aria-label="Select month">
				{#each months as month (month.index)}
					{@const selected = isSelected(month.index)}
					{@const current = isCurrent(month.index)}
					<button
						type="button"
						role="option"
						aria-selected={selected}
						aria-label={month.full}
						onclick={() => selectMonth(month.index)}
						class={gridButtonClass(selected, current)}
					>
						{month.label}
						{#if current && !selected}
							<span
								class="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-500"
								aria-hidden="true"
							></span>
						{/if}
					</button>
				{/each}
			</div>
		{:else}
			<div class="grid grid-cols-3 gap-2" role="listbox" aria-label="Select year">
				{#each years as y (y)}
					{@const selected = year === y}
					{@const current = today.getFullYear() === y}
					{@const disabled = y < minYear || y > maxYear}
					<button
						type="button"
						role="option"
						aria-selected={selected}
						{disabled}
						onclick={() => selectYear(y)}
						class={[gridButtonClass(selected, current, disabled), 'tabular-nums']}
					>
						{y}
						{#if current && !selected}
							<span
								class="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-500"
								aria-hidden="true"
							></span>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div class="flex items-center justify-between gap-2 border-t border-border px-3 py-2.5">
		<div class="min-w-0">
			<p class="text-xs font-medium text-primary">Selected</p>
			<p class="truncate text-[11px] text-muted">{selectedLabel}</p>
		</div>
		<button
			type="button"
			class="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/40"
			onclick={goThisMonth}
		>
			This month
		</button>
	</div>
</div>
