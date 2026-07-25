<script lang="ts">
	import Scheduler from './Scheduler.svelte';
	import type { ScheduleDuration, SchedulerSlotLayout } from './Scheduler.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface Props {
		variant?: 'default' | 'list' | 'compact' | 'range';
	}

	let { variant = 'default' }: Props = $props();

	let selectedSlotId = $state<string | null>(null);
	let duration = $state<ScheduleDuration>(30);
	let slotLayout = $state<SchedulerSlotLayout>(variant === 'list' ? 'list' : 'grid');
	const today = new Date();
	const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
	let start = $state(todayIso);
	let end = $state('');
	let last = $state('');

	const isRange = $derived(variant === 'range');
</script>

<div class="space-y-3 p-2">
	{#if isRange}
		<Scheduler
			mode="range"
			bind:selectedSlotId
			bind:duration
			bind:slotLayout
			bind:start
			bind:end
			allowDateOnly
			title="Reserve dates"
			description="Pick a date range, then a check-in time."
			confirmLabel="Reserve"
			onconfirm={(d) => {
				last = `range ${d.start}→${d.end} (${d.nights}n) slot=${d.slotId ?? 'none'}`;
				selectedSlotId = null;
			}}
			onrangechange={(d) => (last = `range:${d.start || '…'}→${d.end || '…'}`)}
			onselect={(id) => (last = `select:${id}`)}
		/>
	{:else}
		<Scheduler
			bind:selectedSlotId
			bind:duration
			bind:slotLayout
			showCalendar={variant !== 'compact'}
			showWeekStrip
			groupByPeriod={variant !== 'compact'}
			onconfirm={(d) => {
				last = `confirmed ${d.date} @ ${d.slotId} (${d.duration}m)`;
				selectedSlotId = null;
			}}
			ondatechange={(d) => (last = `date:${d}`)}
			onselect={(id) => (last = `select:${id}`)}
		/>
	{/if}
	{#if last}
		<Text size="xs" tone="muted">Last action: {last}</Text>
	{/if}
</div>
