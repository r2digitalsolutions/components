<script lang="ts">
	import FeatureComparison from './FeatureComparison.svelte';

	const plans = ['Free', 'Pro', 'Enterprise'];
	const features = [
		{ id: 'projects', label: 'Projects', values: ['3', 'Unlimited', 'Unlimited'] },
		{ id: 'components', label: 'All components', values: [false, true, true] },
		{ id: 'sso', label: 'SSO', values: [false, false, true] },
		{ id: 'support', label: 'Support', values: ['Community', 'Priority', 'Dedicated'] }
	];
</script>

<FeatureComparison {plans} {features} class="max-w-3xl" />
