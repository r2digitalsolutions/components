<script lang="ts">
	import SegmentedPager from './SegmentedPager.svelte';

	let active = $state(0);

	const pages = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'usage', label: 'Usage' },
		{ id: 'billing', label: 'Billing' },
		{ id: 'settings', label: 'Settings' }
	];
</script>

<div class="mx-auto max-w-md p-4">
	<SegmentedPager {pages} bind:active onchange={(i) => (active = i)}>
		<div class="space-y-2 text-center">
			<p class="text-sm font-semibold text-primary">{pages[active].label}</p>
			<p class="text-xs text-muted">Content for segment {active + 1}</p>
		</div>
	</SegmentedPager>
</div>
