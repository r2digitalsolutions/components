<script lang="ts">
	interface YearPickerProps {
		/** Selected year (full year number) */
		value?: number;
		min?: number;
		max?: number;
		class?: string;
		onchange?: (year: number) => void;
	}

	let {
		value = $bindable(new Date().getFullYear()),
		min = new Date().getFullYear() - 80,
		max = new Date().getFullYear() + 20,
		class: className = '',
		onchange
	}: YearPickerProps = $props();

	const todayYear = new Date().getFullYear();

	/** Anchor for the 12-year window (floor to multiple of 12). */
	let decadeAnchor = $state(Math.floor(value / 12) * 12);

	$effect(() => {
		decadeAnchor = Math.floor(value / 12) * 12;
	});

	const years = $derived(Array.from({ length: 12 }, (_, i) => decadeAnchor + i));
	const rangeLabel = $derived(`${decadeAnchor} – ${decadeAnchor + 11}`);

	function select(year: number) {
		if (year < min || year > max) return;
		value = year;
		onchange?.(year);
	}

	function shift(delta: number) {
		decadeAnchor += delta * 12;
	}

	function goThisYear() {
		value = todayYear;
		decadeAnchor = Math.floor(todayYear / 12) * 12;
		onchange?.(value);
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
			aria-label="Previous years"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
		<p class="text-sm font-semibold tabular-nums text-primary">{rangeLabel}</p>
		<button
			type="button"
			class="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-overlay hover:text-primary"
			onclick={() => shift(1)}
			aria-label="Next years"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>

	<div class="p-3">
		<div class="grid grid-cols-3 gap-2" role="listbox" aria-label="Select year">
			{#each years as year (year)}
				{@const selected = value === year}
				{@const current = todayYear === year}
				{@const disabled = year < min || year > max}
				<button
					type="button"
					role="option"
					aria-selected={selected}
					{disabled}
					onclick={() => select(year)}
					class={[
						'relative rounded-xl px-2 py-3 text-sm tabular-nums transition-colors',
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
					]}
				>
					{year}
					{#if current && !selected}
						<span
							class="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-500"
							aria-hidden="true"
						></span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<div class="flex items-center justify-between gap-2 border-t border-border px-3 py-2.5">
		<div class="min-w-0">
			<p class="text-xs font-medium text-primary">Selected</p>
			<p class="truncate text-[11px] tabular-nums text-muted">{value}</p>
		</div>
		<button
			type="button"
			class="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/40"
			onclick={goThisYear}
		>
			This year
		</button>
	</div>
</div>
