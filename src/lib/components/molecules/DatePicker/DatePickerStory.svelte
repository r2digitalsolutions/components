<script lang="ts">
	import DatePicker from './DatePicker.svelte';
	import type { CalendarMode } from '../Calendar/Calendar.svelte';

	let {
		mode = 'single',
		months = 1,
		variant = 'field',
		label = 'Date',
		closeOnSelect = true,
		placement = 'auto'
	}: {
		mode?: CalendarMode;
		months?: 1 | 2;
		variant?: 'field' | 'split';
		label?: string;
		closeOnSelect?: boolean;
		placement?: 'auto' | 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end';
	} = $props();

	const today = new Date();
	const iso = (day: number, monthOffset = 0) => {
		const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, day);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	};

	let value = $state(iso(today.getDate()));
	let values = $state([iso(3), iso(10)]);
	let start = $state(iso(5));
	let end = $state(iso(12));
	let open = $state(false);
</script>

<div
	class={[
		'flex min-h-96 max-w-full flex-col space-y-3',
		months === 2 ? 'w-[36rem]' : 'w-[20rem]'
	]}
>
	{#if mode === 'single'}
		<DatePicker
			mode="single"
			{months}
			{variant}
			{label}
			{closeOnSelect}
			{placement}
			bind:value
			bind:open
			placeholder="Pick a date"
		/>
		<p class="text-xs text-muted">Value: <span class="text-primary">{value || '—'}</span></p>
	{:else if mode === 'multiple'}
		<DatePicker
			mode="multiple"
			{months}
			{label}
			{placement}
			closeOnSelect={false}
			bind:values
			bind:open
			placeholder="Pick dates"
		/>
		<p class="text-xs text-muted">
			Values: <span class="text-primary">{values.join(', ') || '—'}</span>
		</p>
	{:else}
		<DatePicker
			mode="range"
			{months}
			{variant}
			{label}
			{closeOnSelect}
			{placement}
			bind:start
			bind:end
			bind:open
			placeholder="Select dates"
			startLabel="Check-in"
			endLabel="Check-out"
		/>
		<p class="text-xs text-muted">
			Range:
			<span class="text-primary">
				{start || '—'} → {end || '—'}
			</span>
		</p>
	{/if}
</div>
