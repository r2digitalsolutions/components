<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Flag from '@lucide/svelte/icons/flag';

	export type FlagEnvironment = 'all' | 'production' | 'staging' | 'development';

	export interface FeatureFlag {
		id: string;
		key: string;
		name: string;
		description?: string;
		enabled?: boolean;
		environment?: FlagEnvironment;
		rollout?: number;
		tags?: string[];
	}

	interface FeatureFlagRowProps {
		flag: FeatureFlag;
		class?: string;
		onchange?: (id: string, enabled: boolean) => void;
		onedit?: (id: string) => void;
	}

	const ENV_VARIANT: Record<
		Exclude<FlagEnvironment, 'all'>,
		'success' | 'warning' | 'info'
	> = {
		production: 'success',
		staging: 'warning',
		development: 'info'
	};

	let { flag, class: className = '', onchange, onedit }: FeatureFlagRowProps = $props();

	let enabled = $state(flag.enabled ?? false);

	$effect(() => {
		enabled = flag.enabled ?? false;
	});

	function setEnabled(v: boolean) {
		enabled = v;
		onchange?.(flag.id, v);
	}
</script>

<div
	class={[
		'flex flex-col gap-3 rounded-xl border border-border bg-surface-elevated p-3 sm:flex-row sm:items-center sm:gap-4',
		className
	]}
>
	<span
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-overlay text-secondary"
	>
		<Flag class="h-5 w-5" strokeWidth={2} />
	</span>

	<div class="min-w-0 flex-1 space-y-1">
		<div class="flex flex-wrap items-center gap-2">
			<p class="text-sm font-semibold text-primary">{flag.name}</p>
			<code class="rounded bg-surface-overlay px-1.5 py-0.5 font-mono text-[11px] text-muted"
				>{flag.key}</code
			>
			{#if flag.environment && flag.environment !== 'all'}
				<Badge size="sm" variant={ENV_VARIANT[flag.environment]}>{flag.environment}</Badge>
			{/if}
			{#if flag.rollout !== undefined && flag.rollout < 100}
				<Badge size="sm" variant="secondary">{flag.rollout}% rollout</Badge>
			{/if}
		</div>
		{#if flag.description}
			<p class="text-xs text-muted">{flag.description}</p>
		{/if}
		{#if flag.tags?.length}
			<div class="flex flex-wrap gap-1 pt-0.5">
				{#each flag.tags as tag (tag)}
					<Badge size="sm" variant="secondary">{tag}</Badge>
				{/each}
			</div>
		{/if}
	</div>

	<div class="flex shrink-0 items-center gap-2 self-start sm:self-center">
		{#if onedit}
			<Button size="xs" variant="ghost" onclick={() => onedit?.(flag.id)}>Edit</Button>
		{/if}
		<Toggle size="sm" bind:checked={enabled} label={enabled ? 'On' : 'Off'} onchange={setEnabled} />
	</div>
</div>
