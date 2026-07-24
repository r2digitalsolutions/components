<script lang="ts">
	interface StatProps {
		label: string;
		value: string | number;
		delta?: string;
		trend?: 'up' | 'down' | 'neutral';
		description?: string;
		class?: string;
	}

	let {
		label,
		value,
		delta,
		trend = 'neutral',
		description,
		class: className = ''
	}: StatProps = $props();
</script>

<div
	class={[
		'rounded-xl border border-border bg-surface-elevated p-4',
		className
	]}
>
	<p class="text-sm font-medium text-secondary">{label}</p>
	<p class="mt-1 text-2xl font-semibold tracking-tight text-primary">{value}</p>
	{#if delta || description}
		<div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
			{#if delta}
				<span
					class={[
						'inline-flex items-center gap-0.5 font-medium',
						trend === 'up' && 'text-green-600 dark:text-green-400',
						trend === 'down' && 'text-red-600 dark:text-red-400',
						trend === 'neutral' && 'text-muted'
					]}
				>
					{#if trend === 'up'}
						<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
						</svg>
					{:else if trend === 'down'}
						<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					{/if}
					{delta}
				</span>
			{/if}
			{#if description}
				<span class="text-muted">{description}</span>
			{/if}
		</div>
	{/if}
</div>
