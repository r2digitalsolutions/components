<script lang="ts">
	import YearPicker from './YearPicker.svelte';

	let props = $props<{ min?: number; max?: number }>();

	let value = $state(new Date().getFullYear());
</script>

<div class="flex w-full max-w-xl flex-col items-start gap-4 sm:flex-row">
	<YearPicker bind:value min={props.min} max={props.max} />

	<div class="min-w-0 flex-1 space-y-3 rounded-2xl border border-border bg-surface-elevated p-4">
		<p class="text-sm font-semibold text-primary">Selected year</p>
		<p class="text-xs leading-relaxed text-secondary">
			Pick a year in the 12-year grid. Use the arrows to move between decades, or jump to the current
			year.
		</p>
		<dl class="space-y-2 text-xs">
			<div class="flex justify-between gap-3 border-b border-border pb-2">
				<dt class="text-muted">Year</dt>
				<dd class="font-medium tabular-nums text-primary">{value}</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-muted">Window</dt>
				<dd class="font-medium tabular-nums text-primary">
					{Math.floor(value / 12) * 12} – {Math.floor(value / 12) * 12 + 11}
				</dd>
			</div>
		</dl>
	</div>
</div>
