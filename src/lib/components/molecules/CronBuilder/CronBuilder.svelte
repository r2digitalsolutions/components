<script module lang="ts">
	export type CronFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';

	export interface CronPreset {
		id: string;
		label: string;
		cron: string;
	}

	export const CRON_PRESETS: CronPreset[] = [
		{ id: 'weekday-9', label: 'Weekdays at 09:00', cron: '0 9 * * 1-5' },
		{ id: 'daily-8', label: 'Every day at 08:00', cron: '0 8 * * *' },
		{ id: 'hourly', label: 'Every hour', cron: '0 * * * *' },
		{ id: 'every-15m', label: 'Every 15 minutes', cron: '*/15 * * * *' },
		{ id: 'monday-10', label: 'Mondays at 10:00', cron: '0 10 * * 1' },
		{ id: 'month-1', label: '1st of month at 00:00', cron: '0 0 1 * *' },
		{ id: 'weekend-noon', label: 'Weekends at 12:00', cron: '0 12 * * 0,6' }
	];

	const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
</script>

<script lang="ts">
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import CopyButton from '$lib/components/molecules/CopyButton/CopyButton.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface CronBuilderProps {
		/** Standard 5-field cron: min hour dom month dow */
		value?: string;
		/** Active frequency mode (derived from value when possible) */
		frequency?: CronFrequency;
		disabled?: boolean;
		showPresets?: boolean;
		showHuman?: boolean;
		showExpression?: boolean;
		showNextRuns?: boolean;
		/** How many upcoming runs to preview */
		nextRunCount?: number;
		/** Minute options step */
		minuteStep?: 1 | 5 | 15 | 30;
		allowedFrequencies?: CronFrequency[];
		presets?: CronPreset[];
		label?: string;
		description?: string;
		size?: 'sm' | 'md';
		class?: string;
		onchange?: (cron: string) => void;
		onfrequency?: (frequency: CronFrequency) => void;
	}

	let {
		value = $bindable('0 9 * * 1-5'),
		frequency = $bindable('weekly' as CronFrequency),
		disabled = false,
		showPresets = true,
		showHuman = true,
		showExpression = true,
		showNextRuns = false,
		nextRunCount = 3,
		minuteStep = 15,
		allowedFrequencies = ['hourly', 'daily', 'weekly', 'monthly', 'custom'],
		presets = CRON_PRESETS,
		label = 'Schedule',
		description,
		size = 'sm',
		class: className = '',
		onchange,
		onfrequency
	}: CronBuilderProps = $props();

	let minute = $state('0');
	let hour = $state('9');
	let hourStep = $state('1'); // every N hours for hourly
	let minuteEvery = $state('15'); // */N for custom-ish hourly minutes
	let dom = $state('1');
	let month = $state('*');
	let dowSelected = $state<string[]>(['1', '2', '3', '4', '5']);
	let customMin = $state('0');
	let customHour = $state('9');
	let customDom = $state('*');
	let customMonth = $state('*');
	let customDow = $state('1-5');
	let lastPublished = $state('');
	let syncing = false;

	const freqItems = $derived(
		(
			[
				{ id: 'hourly', label: 'Hourly' },
				{ id: 'daily', label: 'Daily' },
				{ id: 'weekly', label: 'Weekly' },
				{ id: 'monthly', label: 'Monthly' },
				{ id: 'custom', label: 'Custom' }
			] as const
		).filter((i) => allowedFrequencies.includes(i.id))
	);

	const hourOptions = Array.from({ length: 24 }, (_, i) => ({
		value: String(i),
		label: `${String(i).padStart(2, '0')}:00`
	}));

	const minuteOptions = $derived.by(() => {
		const step = minuteStep;
		const out: { value: string; label: string }[] = [];
		for (let m = 0; m < 60; m += step) {
			out.push({ value: String(m), label: `:${String(m).padStart(2, '0')}` });
		}
		return out;
	});

	const hourStepOptions = [
		{ value: '1', label: 'Every hour' },
		{ value: '2', label: 'Every 2 hours' },
		{ value: '3', label: 'Every 3 hours' },
		{ value: '4', label: 'Every 4 hours' },
		{ value: '6', label: 'Every 6 hours' },
		{ value: '12', label: 'Every 12 hours' }
	];

	const minuteEveryOptions = [
		{ value: '5', label: 'Every 5 min' },
		{ value: '10', label: 'Every 10 min' },
		{ value: '15', label: 'Every 15 min' },
		{ value: '20', label: 'Every 20 min' },
		{ value: '30', label: 'Every 30 min' }
	];

	const domOptions = Array.from({ length: 28 }, (_, i) => ({
		value: String(i + 1),
		label: `${i + 1}${ordinal(i + 1)}`
	}));

	const monthOptions = [
		{ value: '*', label: 'Every month' },
		...['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
			(label, i) => ({ value: String(i + 1), label })
		)
	];

	const presetOptions = $derived([
		{ value: '', label: 'Choose a preset…' },
		...presets.map((p) => ({ value: p.cron, label: p.label }))
	]);

	function ordinal(n: number) {
		const s = ['th', 'st', 'nd', 'rd'];
		const v = n % 100;
		return s[(v - 20) % 10] || s[v] || s[0];
	}

	function detectFrequency(cron: string): CronFrequency {
		const p = cron.trim().split(/\s+/);
		if (p.length < 5) return 'custom';
		const [mi, h, d, mo, dw] = p;
		if (mi.startsWith('*/') && h === '*' && d === '*' && mo === '*' && dw === '*') return 'hourly';
		if (h.startsWith('*/') && d === '*' && mo === '*' && dw === '*') return 'hourly';
		if (mi !== '*' && !mi.includes('/') && h === '*' && d === '*' && mo === '*' && dw === '*')
			return 'hourly';
		if (d === '*' && mo === '*' && (dw === '*' || dw === '')) return 'daily';
		if (d !== '*' && d !== '?' && mo !== undefined && (dw === '*' || dw === '?')) return 'monthly';
		if (dw !== '*' && d === '*') return 'weekly';
		return 'custom';
	}

	function parseDow(field: string): string[] {
		if (field === '*') return ['0', '1', '2', '3', '4', '5', '6'];
		if (field === '1-5') return ['1', '2', '3', '4', '5'];
		if (field === '0,6' || field === '6,0') return ['0', '6'];
		return field.split(',').flatMap((part) => {
			if (part.includes('-')) {
				const [a, b] = part.split('-').map(Number);
				const out: string[] = [];
				for (let i = a; i <= b; i++) out.push(String(i));
				return out;
			}
			return [part.replace('7', '0')];
		});
	}

	function encodeDow(days: string[]): string {
		const sorted = [...new Set(days.map((d) => (d === '7' ? '0' : d)))].sort(
			(a, b) => Number(a) - Number(b)
		);
		if (sorted.length === 7) return '*';
		if (sorted.join(',') === '1,2,3,4,5') return '1-5';
		if (sorted.join(',') === '0,6') return '0,6';
		return sorted.join(',') || '*';
	}

	function applyCron(cron: string, setFreq = true) {
		const p = cron.trim().split(/\s+/);
		if (p.length < 5) return;
		const [mi, h, d, mo, dw] = p;
		syncing = true;
		customMin = mi;
		customHour = h;
		customDom = d;
		customMonth = mo;
		customDow = dw;

		if (mi.startsWith('*/')) {
			minuteEvery = mi.slice(2);
			minute = '0';
			hour = '0';
			hourStep = '1';
		} else if (h.startsWith('*/')) {
			hourStep = h.slice(2);
			minute = mi;
			hour = '0';
		} else {
			minute = /^\d+$/.test(mi) ? mi : '0';
			hour = /^\d+$/.test(h) ? h : '9';
			hourStep = '1';
		}

		dom = /^\d+$/.test(d) ? d : '1';
		month = mo;
		dowSelected = parseDow(dw);
		if (setFreq) frequency = detectFrequency(cron);
		syncing = false;
	}

	function buildCron(): string {
		switch (frequency) {
			case 'hourly':
				if (Number(hourStep) > 1) return `${minute} */${hourStep} * * *`;
				return `${minute} * * * *`;
			case 'daily':
				return `${minute} ${hour} * * *`;
			case 'weekly':
				return `${minute} ${hour} * * ${encodeDow(dowSelected)}`;
			case 'monthly':
				return `${minute} ${hour} ${dom} ${month} *`;
			case 'custom':
				return `${customMin} ${customHour} ${customDom} ${customMonth} ${customDow}`;
			default:
				return value;
		}
	}

	function publish() {
		if (syncing || disabled) return;
		const next = buildCron();
		lastPublished = next;
		value = next;
		onchange?.(next);
	}

	function setFrequency(id: string) {
		if (disabled) return;
		frequency = id as CronFrequency;
		onfrequency?.(frequency);
		publish();
	}

	function toggleDow(day: string) {
		if (disabled) return;
		if (dowSelected.includes(day)) {
			if (dowSelected.length === 1) return;
			dowSelected = dowSelected.filter((d) => d !== day);
		} else {
			dowSelected = [...dowSelected, day];
		}
		publish();
	}

	function applyPreset(cron: string) {
		if (!cron || disabled) return;
		applyCron(cron, true);
		lastPublished = cron;
		value = cron;
		onchange?.(cron);
	}

	function setEveryMinutes(n: string) {
		if (disabled) return;
		minuteEvery = n;
		frequency = 'custom';
		customMin = `*/${n}`;
		customHour = '*';
		customDom = '*';
		customMonth = '*';
		customDow = '*';
		onfrequency?.('custom');
		publish();
	}

	// Hydrate from external value changes
	$effect(() => {
		const v = value.trim();
		if (!v || v === lastPublished) return;
		applyCron(v, true);
		lastPublished = v;
	});

	const human = $derived.by(() => {
		const t = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
		switch (frequency) {
			case 'hourly':
				if (Number(hourStep) > 1) return `Every ${hourStep} hours at :${minute.padStart(2, '0')}`;
				return `Every hour at :${minute.padStart(2, '0')}`;
			case 'daily':
				return `Every day at ${t}`;
			case 'weekly': {
				const days = [...dowSelected]
					.sort((a, b) => Number(a) - Number(b))
					.map((d) => DOW_LABELS[Number(d)] ?? d)
					.join(', ');
				return `Every ${days} at ${t}`;
			}
			case 'monthly': {
				const mo = monthOptions.find((m) => m.value === month)?.label ?? month;
				return `On the ${dom}${ordinal(Number(dom))} (${mo}) at ${t}`;
			}
			case 'custom':
				return `Custom expression · ${value}`;
			default:
				return value;
		}
	});

	const nextRuns = $derived.by(() => {
		if (!showNextRuns) return [] as Date[];
		return estimateNextRuns(value, nextRunCount);
	});

	function dayMatches(domField: string, dowField: string, date: Date) {
		const domStar = domField === '*' || domField === '?';
		const dowStar = dowField === '*' || dowField === '?';
		const domOk = matchField(domField, date.getDate());
		const dowOk = matchField(dowField, date.getDay());
		if (domStar && dowStar) return true;
		if (!domStar && !dowStar) return domOk || dowOk;
		if (!domStar) return domOk;
		return dowOk;
	}

	function estimateNextRuns(cron: string, count: number): Date[] {
		const p = cron.trim().split(/\s+/);
		if (p.length < 5) return [];
		const [mi, h, d, mo, dw] = p;
		const out: Date[] = [];
		const cursor = new Date();
		cursor.setSeconds(0, 0);
		cursor.setMinutes(cursor.getMinutes() + 1);

		for (let guard = 0; guard < 366 * 24 * 60 && out.length < count; guard++) {
			if (
				matchField(mi, cursor.getMinutes()) &&
				matchField(h, cursor.getHours()) &&
				matchField(mo, cursor.getMonth() + 1) &&
				dayMatches(d, dw, cursor)
			) {
				out.push(new Date(cursor));
				cursor.setMinutes(cursor.getMinutes() + 1);
				continue;
			}
			cursor.setMinutes(cursor.getMinutes() + 1);
		}
		return out;
	}

	function matchField(field: string, valueN: number): boolean {
		if (field === '*' || field === '?') return true;
		if (field.startsWith('*/')) {
			const step = Number(field.slice(2));
			return Number.isFinite(step) && step > 0 && valueN % step === 0;
		}
		return field.split(',').some((part) => {
			if (part.includes('-')) {
				const [a, b] = part.split('-').map(Number);
				return valueN >= a && valueN <= b;
			}
			return Number(part === '7' ? '0' : part) === valueN;
		});
	}

	function formatRun(d: Date) {
		return d.toLocaleString(undefined, {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div
	class={[
		'space-y-4 rounded-xl border border-border bg-surface-elevated p-4',
		disabled && 'opacity-60',
		className
	]}
>
	<div class="flex flex-wrap items-start justify-between gap-2">
		<div class="min-w-0">
			{#if label}
				<p class="text-sm font-semibold text-primary">{label}</p>
			{/if}
			{#if description}
				<Text size="xs" tone="muted" class="mt-0.5">{description}</Text>
			{/if}
		</div>
		{#if showExpression}
			<div class="flex items-center gap-1.5">
				<code
					class="rounded-md bg-surface-overlay px-2 py-1 font-mono text-[11px] text-secondary"
				>
					{value}
				</code>
				<CopyButton {value} size="xs" variant="ghost" label="Copy" />
			</div>
		{/if}
	</div>

	{#if showPresets && presets.length}
		<Select
			label="Presets"
			{size}
			disabled={disabled}
			options={presetOptions}
			value=""
			onchange={(v) => applyPreset(v)}
		/>
	{/if}

	{#if freqItems.length > 1}
		<SegmentedControl
			items={[...freqItems]}
			value={frequency}
			size="sm"
			fullWidth
			onchange={setFrequency}
		/>
	{/if}

	{#if frequency === 'hourly'}
		<div class="grid gap-3 sm:grid-cols-2">
			<Select
				label="Repeat"
				{size}
				disabled={disabled}
				options={hourStepOptions}
				value={hourStep}
				onchange={(v) => {
					hourStep = v;
					publish();
				}}
			/>
			<Select
				label="At minute"
				{size}
				disabled={disabled}
				options={minuteOptions}
				value={minute}
				onchange={(v) => {
					minute = v;
					publish();
				}}
			/>
		</div>
		<details class="text-xs text-secondary">
			<summary class="cursor-pointer select-none text-muted hover:text-primary">
				Or run every N minutes
			</summary>
			<div class="mt-2">
				<Select
					label="Interval"
					{size}
					disabled={disabled}
					options={minuteEveryOptions}
					value={minuteEvery}
					onchange={setEveryMinutes}
				/>
			</div>
		</details>
	{:else if frequency === 'daily'}
		<div class="grid gap-3 sm:grid-cols-2">
			<Select
				label="Hour"
				{size}
				disabled={disabled}
				options={hourOptions}
				value={hour}
				onchange={(v) => {
					hour = v;
					publish();
				}}
			/>
			<Select
				label="Minute"
				{size}
				disabled={disabled}
				options={minuteOptions}
				value={minute}
				onchange={(v) => {
					minute = v;
					publish();
				}}
			/>
		</div>
	{:else if frequency === 'weekly'}
		<div class="grid gap-3 sm:grid-cols-2">
			<Select
				label="Hour"
				{size}
				disabled={disabled}
				options={hourOptions}
				value={hour}
				onchange={(v) => {
					hour = v;
					publish();
				}}
			/>
			<Select
				label="Minute"
				{size}
				disabled={disabled}
				options={minuteOptions}
				value={minute}
				onchange={(v) => {
					minute = v;
					publish();
				}}
			/>
		</div>
		<div>
			<p class="mb-1.5 text-xs font-medium text-secondary">Days of week</p>
			<div class="flex flex-wrap gap-1.5">
				{#each DOW_LABELS as name, i}
					<button
						type="button"
						disabled={disabled}
						class={[
							'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
							dowSelected.includes(String(i))
								? 'border-brand-500/40 bg-brand-500/10 text-brand-700 dark:text-brand-300'
								: 'border-border bg-surface text-secondary hover:border-border-strong hover:text-primary',
							disabled && 'cursor-not-allowed opacity-50'
						]}
						aria-pressed={dowSelected.includes(String(i))}
						onclick={() => toggleDow(String(i))}
					>
						{name}
					</button>
				{/each}
			</div>
		</div>
	{:else if frequency === 'monthly'}
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<Select
				label="Day"
				{size}
				disabled={disabled}
				options={domOptions}
				value={dom}
				onchange={(v) => {
					dom = v;
					publish();
				}}
			/>
			<Select
				label="Month"
				{size}
				disabled={disabled}
				options={monthOptions}
				value={month}
				onchange={(v) => {
					month = v;
					publish();
				}}
			/>
			<Select
				label="Hour"
				{size}
				disabled={disabled}
				options={hourOptions}
				value={hour}
				onchange={(v) => {
					hour = v;
					publish();
				}}
			/>
			<Select
				label="Minute"
				{size}
				disabled={disabled}
				options={minuteOptions}
				value={minute}
				onchange={(v) => {
					minute = v;
					publish();
				}}
			/>
		</div>
	{:else}
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
			<Select
				label="Minute"
				{size}
				disabled={disabled}
				options={[
					{ value: '*', label: 'Every (*)' },
					...minuteEveryOptions.map((o) => ({ value: `*/${o.value}`, label: o.label })),
					...minuteOptions
				]}
				value={customMin}
				onchange={(v) => {
					customMin = v;
					publish();
				}}
			/>
			<Select
				label="Hour"
				{size}
				disabled={disabled}
				options={[
					{ value: '*', label: 'Every (*)' },
					...hourStepOptions
						.filter((o) => o.value !== '1')
						.map((o) => ({ value: `*/${o.value}`, label: o.label })),
					...hourOptions
				]}
				value={customHour}
				onchange={(v) => {
					customHour = v;
					publish();
				}}
			/>
			<Select
				label="Day (month)"
				{size}
				disabled={disabled}
				options={[{ value: '*', label: 'Every (*)' }, ...domOptions]}
				value={customDom}
				onchange={(v) => {
					customDom = v;
					publish();
				}}
			/>
			<Select
				label="Month"
				{size}
				disabled={disabled}
				options={monthOptions}
				value={customMonth}
				onchange={(v) => {
					customMonth = v;
					publish();
				}}
			/>
			<Select
				label="Day (week)"
				{size}
				disabled={disabled}
				options={[
					{ value: '*', label: 'Every (*)' },
					{ value: '1-5', label: 'Weekdays' },
					{ value: '0,6', label: 'Weekends' },
					...DOW_LABELS.map((name, i) => ({ value: String(i), label: name }))
				]}
				value={customDow}
				onchange={(v) => {
					customDow = v;
					publish();
				}}
			/>
		</div>
	{/if}

	{#if showHuman}
		<p class="text-xs text-secondary">{human}</p>
	{/if}

	{#if showNextRuns && nextRuns.length}
		<div class="rounded-lg border border-border bg-surface px-3 py-2">
			<p class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Next runs</p>
			<ul class="space-y-0.5">
				{#each nextRuns as run}
					<li class="text-xs tabular-nums text-secondary">{formatRun(run)}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
