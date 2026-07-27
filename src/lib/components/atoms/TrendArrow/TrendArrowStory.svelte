<script lang="ts">
	import TrendArrow from './TrendArrow.svelte';
</script>

<div class="flex flex-wrap items-center gap-6 text-sm font-medium">
	<span class="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
		<TrendArrow direction="up" />
		+12.4%
	</span>
	<span class="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
		<TrendArrow direction="down" />
		-3.1%
	</span>
	<span class="inline-flex items-center gap-1 text-muted">
		<TrendArrow direction="flat" />
		0.0%
	</span>
</div>

<div class="mt-4 flex items-center gap-3">
	<TrendArrow direction="up" size="sm" />
	<TrendArrow direction="down" size="md" />
	<TrendArrow direction="flat" size="lg" />
</div>
