<script lang="ts">
	import WeekPicker from './WeekPicker.svelte';

	let props = $props<{ locale?: string }>();

	let value = $state(new Date());

	function startOfIsoWeek(d: Date) {
		const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		const day = (date.getDay() + 6) % 7;
		date.setDate(date.getDate() - day);
		return date;
	}

	const weekStart = $derived(startOfIsoWeek(value));
	const weekEnd = $derived(
		new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6)
	);
</script>

<div class="flex w-full max-w-xl flex-col items-start gap-4 sm:flex-row">
	<WeekPicker bind:value locale={props.locale ?? 'en'} />

	<div class="min-w-0 flex-1 space-y-3 rounded-2xl border border-border bg-surface-elevated p-4">
		<p class="text-sm font-semibold text-primary">Selected week</p>
		<p class="text-xs leading-relaxed text-secondary">
			Click a row to select that ISO week (Mon–Sun). Click the month or year in the header to jump.
		</p>
		<dl class="space-y-2 text-xs">
			<div class="flex justify-between gap-3 border-b border-border pb-2">
				<dt class="text-muted">Starts</dt>
				<dd class="font-medium text-primary">
					{weekStart.toLocaleDateString(props.locale ?? 'en', {
						weekday: 'short',
						month: 'short',
						day: 'numeric'
					})}
				</dd>
			</div>
			<div class="flex justify-between gap-3 border-b border-border pb-2">
				<dt class="text-muted">Ends</dt>
				<dd class="font-medium text-primary">
					{weekEnd.toLocaleDateString(props.locale ?? 'en', {
						weekday: 'short',
						month: 'short',
						day: 'numeric',
						year: 'numeric'
					})}
				</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-muted">Days</dt>
				<dd class="font-medium text-primary">7</dd>
			</div>
		</dl>
	</div>
</div>
