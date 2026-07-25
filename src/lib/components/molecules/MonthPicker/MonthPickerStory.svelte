<script lang="ts">
	import MonthPicker from './MonthPicker.svelte';

	let props = $props<{ locale?: string }>();

	let value = $state(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
</script>

<div class="flex w-full max-w-xl flex-col items-start gap-4 sm:flex-row">
	<MonthPicker bind:value locale={props.locale ?? 'en'} />

	<div class="min-w-0 flex-1 space-y-3 rounded-2xl border border-border bg-surface-elevated p-4">
		<p class="text-sm font-semibold text-primary">Selected month</p>
		<p class="text-xs leading-relaxed text-secondary">
			Pick a month in the grid. Click the year to open the year picker, or use the arrows / This month.
		</p>
		<dl class="space-y-2 text-xs">
			<div class="flex justify-between gap-3 border-b border-border pb-2">
				<dt class="text-muted">Month</dt>
				<dd class="font-medium text-primary">
					{value.toLocaleString(props.locale ?? 'en', { month: 'long' })}
				</dd>
			</div>
			<div class="flex justify-between gap-3 border-b border-border pb-2">
				<dt class="text-muted">Year</dt>
				<dd class="font-medium tabular-nums text-primary">{value.getFullYear()}</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-muted">Value</dt>
				<dd class="font-mono text-[11px] text-primary">
					{value.toISOString().slice(0, 10)}
				</dd>
			</div>
		</dl>
	</div>
</div>
