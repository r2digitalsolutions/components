<script lang="ts">
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface CronBuilderProps {
		/** Standard 5-field cron: min hour dom month dow */
		value?: string;
		class?: string;
		onchange?: (cron: string) => void;
	}

	let {
		value = $bindable('0 9 * * 1-5'),
		class: className = '',
		onchange
	}: CronBuilderProps = $props();

	const initial = value.trim().split(/\s+/);
	let minute = $state(initial[0] ?? '0');
	let hour = $state(initial[1] ?? '9');
	let dow = $state(initial[4] ?? '1-5');

	function publish(m: string, h: string, d: string) {
		value = `${m} ${h} * * ${d}`;
		onchange?.(value);
	}

	const hourOptions = Array.from({ length: 24 }, (_, i) => ({
		value: String(i),
		label: `${String(i).padStart(2, '0')}:00`
	}));

	const minuteOptions = [
		{ value: '0', label: ':00' },
		{ value: '15', label: ':15' },
		{ value: '30', label: ':30' },
		{ value: '45', label: ':45' }
	];

	const dowOptions = [
		{ value: '*', label: 'Every day' },
		{ value: '1-5', label: 'Weekdays' },
		{ value: '0,6', label: 'Weekends' },
		{ value: '1', label: 'Mondays' },
		{ value: '5', label: 'Fridays' }
	];

	const human = $derived.by(() => {
		const day =
			dowOptions.find((o) => o.value === dow)?.label.toLowerCase() ?? `days ${dow}`;
		const t = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
		return `Runs at ${t}, ${day}`;
	});
</script>

<div class={['space-y-3 rounded-xl border border-border bg-surface-elevated p-4', className]}>
	<div class="grid gap-3 sm:grid-cols-3">
		<Select
			label="Hour"
			size="sm"
			options={hourOptions}
			value={hour}
			onchange={(v) => {
				hour = v;
				publish(minute, v, dow);
			}}
		/>
		<Select
			label="Minute"
			size="sm"
			options={minuteOptions}
			value={minute}
			onchange={(v) => {
				minute = v;
				publish(v, hour, dow);
			}}
		/>
		<Select
			label="Days"
			size="sm"
			options={dowOptions}
			value={dow}
			onchange={(v) => {
				dow = v;
				publish(minute, hour, v);
			}}
		/>
	</div>
	<div class="flex flex-wrap items-center justify-between gap-2">
		<Text size="xs" tone="muted">{human}</Text>
		<code class="rounded-md bg-surface-overlay px-2 py-1 font-mono text-[11px] text-secondary">
			{value}
		</code>
	</div>
</div>
