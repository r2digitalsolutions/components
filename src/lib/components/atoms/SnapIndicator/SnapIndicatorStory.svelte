<script lang="ts">
	import SnapIndicator from './SnapIndicator.svelte';

	let active = $state(1);
	let barsActive = $state(0);
</script>

<div class="flex flex-col gap-8">
	<div class="space-y-3">
		<p class="text-xs font-medium uppercase tracking-wide text-muted">Pills (active largo)</p>
		<div class="flex flex-wrap items-center gap-6">
			<SnapIndicator count={5} active={active} variant="pills" onselect={(i) => (active = i)} />
			<SnapIndicator count={5} active={active} variant="pills" size="lg" onselect={(i) => (active = i)} />
			<SnapIndicator count={3} active={0} variant="pills" size="sm" />
		</div>
		<p class="text-sm text-muted">Active: {active + 1}</p>
	</div>

	<div class="space-y-3">
		<p class="text-xs font-medium uppercase tracking-wide text-muted">Dots</p>
		<div class="flex flex-wrap items-center gap-6">
			<SnapIndicator count={5} active={2} variant="dots" />
			<SnapIndicator count={4} active={1} variant="dots" size="lg" />
		</div>
	</div>

	<div class="space-y-3">
		<p class="text-xs font-medium uppercase tracking-wide text-muted">Bars</p>
		<SnapIndicator
			count={4}
			active={barsActive}
			variant="bars"
			size="md"
			class="max-w-sm"
			onselect={(i) => (barsActive = i)}
		/>
		<p class="text-sm text-muted">Active bar: {barsActive + 1}</p>
	</div>
</div>
