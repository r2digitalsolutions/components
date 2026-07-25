<script lang="ts">
	import CronBuilder, {
		type CronFrequency,
		CRON_PRESETS
	} from './CronBuilder.svelte';

	type Example = 'playground' | 'deploy' | 'backup' | 'reports' | 'minimal' | 'disabled';

	let props = $props<{
		example?: Example;
		showPresets?: boolean;
		showHuman?: boolean;
		showExpression?: boolean;
		showNextRuns?: boolean;
		nextRunCount?: number;
		minuteStep?: 1 | 5 | 15 | 30;
		disabled?: boolean;
		frequency?: CronFrequency;
	}>();

	let value = $state('0 9 * * 1-5');
	let frequency = $state<CronFrequency>('weekly');
	let last = $state('—');

	const example = $derived(props.example ?? 'playground');

	$effect(() => {
		switch (example) {
			case 'deploy':
				value = '0 */2 * * *';
				frequency = 'hourly';
				break;
			case 'backup':
				value = '30 2 * * 0';
				frequency = 'weekly';
				break;
			case 'reports':
				value = '0 8 1 * *';
				frequency = 'monthly';
				break;
			case 'minimal':
				value = '0 8 * * *';
				frequency = 'daily';
				break;
			case 'disabled':
				value = '0 9 * * 1-5';
				frequency = 'weekly';
				break;
			default:
				value = '0 9 * * 1-5';
				frequency = 'weekly';
		}
	});
</script>

<div class="w-full max-w-xl space-y-2">
	<p class="text-xs text-secondary">
		Current: <code class="font-mono text-primary">{value}</code>
		· last change: {last}
	</p>

	{#if example === 'deploy'}
		<CronBuilder
			bind:value
			bind:frequency
			label="Deploy pipeline"
			description="How often should production deploys run?"
			showPresets={props.showPresets ?? true}
			showHuman={props.showHuman ?? true}
			showExpression={props.showExpression ?? true}
			showNextRuns={props.showNextRuns ?? true}
			nextRunCount={props.nextRunCount ?? 4}
			minuteStep={props.minuteStep ?? 15}
			allowedFrequencies={['hourly', 'daily', 'custom']}
			presets={CRON_PRESETS.filter((p) =>
				['hourly', 'every-15m', 'weekday-9', 'daily-8'].includes(p.id)
			)}
			onchange={(c) => (last = c)}
		/>
	{:else if example === 'backup'}
		<CronBuilder
			bind:value
			bind:frequency
			label="Database backup"
			description="Weekly off-peak backup window"
			showNextRuns={props.showNextRuns ?? true}
			nextRunCount={props.nextRunCount ?? 3}
			minuteStep={props.minuteStep ?? 5}
			showPresets={props.showPresets ?? true}
			onchange={(c) => (last = c)}
		/>
	{:else if example === 'reports'}
		<CronBuilder
			bind:value
			bind:frequency
			label="Monthly report"
			description="Email digest on the first morning of each month"
			showNextRuns={true}
			nextRunCount={3}
			allowedFrequencies={['monthly', 'weekly', 'custom']}
			onchange={(c) => (last = c)}
		/>
	{:else if example === 'minimal'}
		<CronBuilder
			bind:value
			bind:frequency
			label="Reminder"
			showPresets={false}
			showExpression={props.showExpression ?? true}
			showHuman={props.showHuman ?? true}
			showNextRuns={false}
			allowedFrequencies={['daily', 'weekly']}
			minuteStep={props.minuteStep ?? 30}
			onchange={(c) => (last = c)}
		/>
	{:else if example === 'disabled'}
		<CronBuilder
			bind:value
			bind:frequency
			label="Locked schedule"
			description="Managed by an admin policy"
			disabled
			showNextRuns
		/>
	{:else}
		<CronBuilder
			bind:value
			bind:frequency
			label="Schedule"
			description="Build a standard 5-field cron expression"
			showPresets={props.showPresets ?? true}
			showHuman={props.showHuman ?? true}
			showExpression={props.showExpression ?? true}
			showNextRuns={props.showNextRuns ?? true}
			nextRunCount={props.nextRunCount ?? 3}
			minuteStep={props.minuteStep ?? 15}
			disabled={props.disabled ?? false}
			onchange={(c) => (last = c)}
		/>
	{/if}
</div>
