<script lang="ts">
	export interface FeatureRow {
		id: string;
		label: string;
		values: (boolean | string)[];
	}

	interface FeatureComparisonProps {
		plans?: string[];
		features?: FeatureRow[];
		class?: string;
	}

	let {
		plans = [],
		features = [],
		class: className = ''
	}: FeatureComparisonProps = $props();
</script>

<div class={['w-full overflow-x-auto rounded-2xl border border-border', className]}>
	<table class="w-full min-w-[32rem] border-collapse text-sm">
		<thead>
			<tr class="border-b border-border bg-surface-overlay/60">
				<th class="px-4 py-3 text-left font-medium text-secondary">Feature</th>
				{#each plans as plan}
					<th class="px-4 py-3 text-center font-semibold text-primary">{plan}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each features as row (row.id)}
				<tr class="border-b border-border last:border-0">
					<td class="px-4 py-3 text-secondary">{row.label}</td>
					{#each row.values as value}
						<td class="px-4 py-3 text-center">
							{#if typeof value === 'boolean'}
								{#if value}
									<span class="text-brand-600 dark:text-brand-400" aria-label="Included">✓</span>
								{:else}
									<span class="text-muted" aria-label="Not included">—</span>
								{/if}
							{:else}
								<span class="text-primary">{value}</span>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
