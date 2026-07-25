<script lang="ts">
	import ContributionGraph from './ContributionGraph.svelte';
	import type { ContributionDay, ContributionPalette } from './ContributionGraph.svelte';

	let {
		palette = 'green' as ContributionPalette,
		weeks = 53
	} = $props<{ palette?: ContributionPalette; weeks?: number }>();

	const data: ContributionDay[] = (() => {
		const out: ContributionDay[] = [];
		const today = new Date();
		for (let i = 0; i < 365; i++) {
			const d = new Date(today);
			d.setDate(today.getDate() - i);
			const iso = d.toISOString().slice(0, 10);
			// Sparse activity with bursts
			const count =
				Math.random() > 0.55 ? 0 : Math.floor(Math.random() ** 1.6 * 12);
			if (count > 0) out.push({ date: iso, count });
		}
		return out;
	})();
</script>

<div class="overflow-x-auto rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm font-semibold text-primary">365 contributions in the last year</p>
	<ContributionGraph {data} {palette} {weeks} />
</div>
