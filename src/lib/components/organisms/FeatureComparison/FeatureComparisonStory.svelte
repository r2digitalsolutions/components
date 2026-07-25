<script lang="ts">
	import FeatureComparison, {
		type FeatureComparisonPlan,
		type FeatureRow
	} from './FeatureComparison.svelte';

	let props = $props<{
		example?: 'simple' | 'rich' | 'grouped';
	}>();

	const example = $derived(props.example ?? 'rich');

	const simplePlans = ['Free', 'Pro', 'Enterprise'];
	const simpleFeatures: FeatureRow[] = [
		{ id: 'projects', label: 'Projects', values: ['3', 'Unlimited', 'Unlimited'] },
		{ id: 'components', label: 'All components', values: [false, true, true] },
		{ id: 'sso', label: 'SSO', values: [false, false, true] },
		{ id: 'support', label: 'Support', values: ['Community', 'Priority', 'Dedicated'] }
	];

	const richPlans: FeatureComparisonPlan[] = [
		{
			id: 'free',
			name: 'Free',
			price: '$0',
			period: 'mo',
			description: 'Side projects',
			cta: 'Get started'
		},
		{
			id: 'pro',
			name: 'Pro',
			price: '$29',
			period: 'mo',
			description: 'Growing teams',
			featured: true,
			cta: 'Start Pro'
		},
		{
			id: 'enterprise',
			name: 'Enterprise',
			price: 'Custom',
			description: 'Large orgs',
			cta: 'Contact sales'
		}
	];

	const groupedFeatures: FeatureRow[] = [
		{ id: 'projects', label: 'Projects', values: ['3', 'Unlimited', 'Unlimited'], group: 'Usage' },
		{ id: 'seats', label: 'Seats', values: ['1', '10', 'Unlimited'], group: 'Usage' },
		{ id: 'components', label: 'All components', values: [false, true, true], group: 'Product' },
		{ id: 'storybook', label: 'Storybook kit', values: [false, true, true], group: 'Product' },
		{ id: 'sso', label: 'SSO', values: [false, false, true], group: 'Security' },
		{ id: 'audit', label: 'Audit logs', values: [false, false, true], group: 'Security' },
		{
			id: 'support',
			label: 'Support',
			values: ['Community', 'Priority', 'Dedicated'],
			group: 'Support'
		}
	];

	let selected = $state('');
</script>

<div class="w-[48rem] max-w-full space-y-3 p-2">
	{#if example === 'simple'}
		<FeatureComparison plans={simplePlans} features={simpleFeatures} />
	{:else if example === 'grouped'}
		<FeatureComparison
			plans={richPlans}
			features={groupedFeatures}
			onselect={(id) => (selected = id)}
		/>
	{:else}
		<FeatureComparison
			plans={richPlans}
			features={simpleFeatures}
			onselect={(id) => (selected = id)}
		/>
	{/if}

	{#if selected}
		<p class="text-center text-xs text-muted">Selected: {selected}</p>
	{/if}
</div>
