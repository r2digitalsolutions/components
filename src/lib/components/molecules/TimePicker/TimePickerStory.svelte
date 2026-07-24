<script lang="ts">
	import TimePicker from './TimePicker.svelte';
	import type { TimeFormat } from './TimePicker.svelte';

	let {
		format = '24h',
		minuteStep = 5,
		label = 'Time',
		disabled = false
	}: {
		format?: TimeFormat;
		minuteStep?: number;
		label?: string;
		disabled?: boolean;
	} = $props();

	let value = $state('09:30');
	let open = $state(false);
</script>

<div class="flex w-64 flex-col gap-3">
	<TimePicker {format} {minuteStep} {label} {disabled} bind:value bind:open />
	<p class="text-xs text-muted">
		Value: <span class="text-primary">{value || '—'}</span>
	</p>
</div>
