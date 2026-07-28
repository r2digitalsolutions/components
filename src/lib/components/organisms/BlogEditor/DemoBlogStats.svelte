<script lang="ts">
	interface Stat {
		label: string;
		value: string;
	}

	interface Props {
		title?: string;
		stats?: Stat[];
	}

	let {
		title = 'By the numbers',
		stats = [
			{ label: 'Components', value: '120+' },
			{ label: 'Apps', value: '18' },
			{ label: 'Uptime', value: '99.9%' }
		]
	}: Props = $props();
</script>

<section class="rounded-xl border border-border bg-surface-overlay/40 p-4">
	{#if title}
		<p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
	{/if}
	<div class="grid grid-cols-3 gap-3">
		{#each stats as stat (stat.label)}
			<div class="text-center">
				<p class="text-xl font-bold text-primary">{stat.value}</p>
				<p class="text-[11px] text-muted">{stat.label}</p>
			</div>
		{/each}
	</div>
</section>
