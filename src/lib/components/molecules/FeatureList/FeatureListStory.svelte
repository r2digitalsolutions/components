<script lang="ts">
	import FeatureList from './FeatureList.svelte';
</script>

<div class="max-w-md rounded-2xl border border-border bg-surface-elevated p-5">
	<FeatureList
		title="Why teams choose us"
		items={[
			{
				id: '1',
				title: 'Atomic building blocks',
				description: 'Compose pages from atoms, molecules, and organisms.',
				icon: 'spark'
			},
			{
				id: '2',
				title: 'Accessible by default',
				description: 'Keyboard support and semantic markup baked in.',
				icon: 'shield'
			},
			{
				id: '3',
				title: 'Ship faster',
				description: 'Storybook-ready components with a shared token system.',
				icon: 'bolt'
			}
		]}
	/>
</div>
