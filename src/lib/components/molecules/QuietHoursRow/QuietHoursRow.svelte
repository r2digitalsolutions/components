<script lang="ts">
	import SettingsRow from '$lib/components/molecules/SettingsRow/SettingsRow.svelte';
	import TimePicker from '$lib/components/molecules/TimePicker/TimePicker.svelte';
	import type { TimeFormat } from '$lib/components/molecules/TimePicker/TimePicker.svelte';
	import Moon from '@lucide/svelte/icons/moon';

	export interface QuietHoursValue {
		enabled: boolean;
		start: string;
		end: string;
	}

	interface QuietHoursRowProps {
		enabled?: boolean;
		/** Start time as `HH:mm` (24h) */
		start?: string;
		/** End time as `HH:mm` (24h) */
		end?: string;
		format?: TimeFormat;
		minuteStep?: number;
		title?: string;
		description?: string;
		class?: string;
		onchange?: (value: QuietHoursValue) => void;
	}

	let {
		enabled = $bindable(false),
		start = $bindable('22:00'),
		end = $bindable('07:00'),
		format = '24h',
		minuteStep = 15,
		title = 'Quiet hours',
		description = 'Pause notifications during set hours.',
		class: className = '',
		onchange
	}: QuietHoursRowProps = $props();

	function emit() {
		onchange?.({ enabled, start, end });
	}
</script>

<div class={['w-full space-y-3 rounded-xl border border-border bg-surface-elevated p-4', className]}>
	<SettingsRow
		{title}
		{description}
		bind:checked={enabled}
		variant="plain"
		onchange={() => emit()}
	/>

	{#if enabled}
		<div class="grid gap-3 border-t border-border pt-3 sm:grid-cols-2">
			<TimePicker
				label="Starts"
				bind:value={start}
				{format}
				{minuteStep}
				placeholder="Select start"
				onchange={() => emit()}
			/>
			<TimePicker
				label="Ends"
				bind:value={end}
				{format}
				{minuteStep}
				placeholder="Select end"
				onchange={() => emit()}
			/>
		</div>
		<p class="flex items-center gap-1.5 text-xs text-muted">
			<Moon class="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
			Notifications muted from {start} to {end}
		</p>
	{/if}
</div>
