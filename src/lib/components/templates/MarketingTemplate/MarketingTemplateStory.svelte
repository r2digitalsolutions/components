<script lang="ts">
	import MarketingTemplate from './MarketingTemplate.svelte';
	import FeatureList from '$lib/components/molecules/FeatureList/FeatureList.svelte';
</script>

<div class="overflow-hidden rounded-2xl border border-border">
	<MarketingTemplate
		heroImage="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80"
	>
		<FeatureList
			items={[
				{ id: '1', title: 'Atoms first', description: 'Small primitives with consistent tokens.' },
				{ id: '2', title: 'Compose freely', description: 'Molecules and organisms for real flows.' },
				{ id: '3', title: 'Ship templates', description: 'Auth, dashboard, marketing, and listings.' }
			]}
		/>
	</MarketingTemplate>
</div>
