<script lang="ts">
	import Calendar, { type CalendarMode } from './Calendar.svelte';

	let {
		mode = 'single',
		months = 1,
		showMinMax = false,
		showDisabledDates = false,
		showEnabledOnly = false,
		showDots = false
	}: {
		mode?: CalendarMode;
		months?: 1 | 2;
		showMinMax?: boolean;
		showDisabledDates?: boolean;
		showEnabledOnly?: boolean;
		showDots?: boolean;
	} = $props();

	const today = new Date();
	const y = today.getFullYear();
	const m = String(today.getMonth() + 1).padStart(2, '0');
	const d = String(today.getDate()).padStart(2, '0');
	const todayIso = `${y}-${m}-${d}`;

	function iso(day: number, monthOffset = 0) {
		const date = new Date(y, today.getMonth() + monthOffset, day);
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
	}

	let value = $state(todayIso);
	let values = $state([iso(3), iso(8), iso(15)]);
	let start = $state(iso(5));
	let end = $state(iso(12));

	const min = $derived(showMinMax ? iso(1) : undefined);
	const max = $derived(showMinMax ? iso(20) : undefined);

	const disabledDates = $derived(
		showDisabledDates ? [iso(4), iso(5), iso(6), iso(18)] : []
	);

	const enabledDates = $derived(
		showEnabledOnly
			? [iso(2), iso(4), iso(7), iso(11), iso(14), iso(21), iso(25)]
			: undefined
	);

	const dots = $derived(
		showDots
			? [
					{ date: iso(3), color: '#22c55e' },
					{ date: iso(9), color: '#f59e0b' },
					{ date: iso(16), color: '#ef4444' },
					{ date: todayIso, color: '#6366f1' }
				]
			: []
	);

	const summary = $derived.by(() => {
		if (mode === 'single') return value || '—';
		if (mode === 'multiple') return values.length ? values.join(', ') : '—';
		if (!start) return '—';
		if (!end) return `${start} → …`;
		return `${start} → ${end}`;
	});
</script>

<div class="space-y-3">
	{#if mode === 'single'}
		<Calendar
			mode="single"
			{months}
			bind:value
			{min}
			{max}
			{disabledDates}
			{enabledDates}
			{dots}
		/>
	{:else if mode === 'multiple'}
		<Calendar
			mode="multiple"
			{months}
			bind:values
			{min}
			{max}
			{disabledDates}
			{enabledDates}
			{dots}
		/>
	{:else}
		<Calendar
			mode="range"
			{months}
			bind:start
			bind:end
			{min}
			{max}
			{disabledDates}
			{enabledDates}
			{dots}
		/>
	{/if}

	<p class="max-w-80 text-xs text-muted">
		{#if mode === 'single'}
			Selected: <span class="font-medium text-primary">{summary}</span>
		{:else if mode === 'multiple'}
			Selected ({values.length}): <span class="font-medium text-primary">{summary}</span>
		{:else}
			Range: <span class="font-medium text-primary">{summary}</span>
		{/if}
	</p>
</div>
