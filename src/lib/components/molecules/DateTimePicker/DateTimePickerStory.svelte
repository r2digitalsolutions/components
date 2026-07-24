<script lang="ts">
	import DateTimePicker from './DateTimePicker.svelte';
	import type { TimeFormat } from '../TimePicker/TimePicker.svelte';

	let {
		format = '24h',
		minuteStep = 5,
		label = 'Date & time',
		closeOnSelect = true
	}: {
		format?: TimeFormat;
		minuteStep?: number;
		label?: string;
		closeOnSelect?: boolean;
	} = $props();

	const today = new Date();
	const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

	let date = $state(iso);
	let time = $state('14:30');
	let value = $state(`${iso}T14:30`);
	let open = $state(false);
</script>

<div class="flex min-h-[26rem] w-[38rem] max-w-full flex-col gap-3">
	<DateTimePicker
		{format}
		{minuteStep}
		{label}
		{closeOnSelect}
		bind:date
		bind:time
		bind:value
		bind:open
	/>
	<p class="text-xs text-muted">
		Value: <span class="text-primary">{value || '—'}</span>
	</p>
</div>
