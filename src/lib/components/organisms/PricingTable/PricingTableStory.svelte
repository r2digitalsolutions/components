<script lang="ts">
	import PricingTable, {
		type PricingComparisonRow,
		type PricingLayout,
		type PricingPlan
	} from './PricingTable.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let props = $props<{
		layout?: PricingLayout;
		columns?: 2 | 3 | 4;
		showBillingToggle?: boolean;
		showFeatures?: boolean;
		showComparison?: boolean;
		maxFeatures?: number;
		planSet?: 'three' | 'two' | 'four' | 'bento' | 'comparison';
		selectedId?: string;
	}>();

	const three: PricingPlan[] = [
		{
			id: 'free',
			name: 'Free',
			price: '$0',
			priceYearly: '$0',
			period: 'mo',
			description: 'For side projects',
			features: [
				'Up to 3 projects',
				'Community support',
				'Basic components',
				{ label: 'SSO', included: false },
				{ label: 'Audit logs', included: false }
			]
		},
		{
			id: 'pro',
			name: 'Pro',
			price: '$29',
			priceYearly: '$290',
			period: 'mo',
			periodYearly: 'yr',
			description: 'For growing teams',
			featured: true,
			badge: 'Popular',
			features: [
				'Unlimited projects',
				'Priority support',
				'All components',
				'Storybook kit',
				{ label: 'SSO', included: false }
			],
			cta: 'Start Pro'
		},
		{
			id: 'enterprise',
			name: 'Enterprise',
			price: 'Custom',
			priceYearly: 'Custom',
			description: 'For large orgs',
			features: ['SSO & audit logs', 'Dedicated support', 'Custom theming', 'SLA'],
			cta: 'Contact sales'
		}
	];

	const two: PricingPlan[] = [
		{
			id: 'starter',
			name: 'Starter',
			price: '$19',
			priceYearly: '$190',
			period: 'mo',
			description: 'Everything to launch',
			features: ['10 projects', 'Email support', 'Core components'],
			cta: 'Start trial'
		},
		{
			id: 'growth',
			name: 'Growth',
			price: '$49',
			priceYearly: '$490',
			period: 'mo',
			featured: true,
			features: ['Unlimited projects', 'Priority support', 'All components', 'Analytics'],
			cta: 'Go Growth'
		}
	];

	const four: PricingPlan[] = [
		{
			id: 'hobby',
			name: 'Hobby',
			price: '$0',
			period: 'mo',
			features: ['1 project', 'Community'],
			cta: 'Get started'
		},
		{
			id: 'starter',
			name: 'Starter',
			price: '$12',
			period: 'mo',
			features: ['5 projects', 'Email support', 'Components'],
			cta: 'Choose Starter'
		},
		{
			id: 'pro',
			name: 'Pro',
			price: '$29',
			period: 'mo',
			featured: true,
			features: ['Unlimited', 'Priority support', 'Storybook kit', 'Analytics'],
			cta: 'Choose Pro'
		},
		{
			id: 'business',
			name: 'Business',
			price: '$79',
			period: 'mo',
			features: ['SSO', 'Audit logs', 'Dedicated CSM', 'SLA'],
			cta: 'Choose Business'
		}
	];

	const bentoPlans: PricingPlan[] = [
		{
			id: 'pro',
			name: 'Pro',
			price: '$29',
			period: 'mo',
			description: 'The sweet spot for product teams shipping fast.',
			featured: true,
			features: [
				'Unlimited projects',
				'Priority support',
				'All components',
				'Storybook kit',
				'Design tokens',
				'Team seats'
			],
			cta: 'Start Pro'
		},
		{
			id: 'free',
			name: 'Free',
			price: '$0',
			period: 'mo',
			description: 'Try the system',
			features: ['3 projects', 'Community support'],
			cta: 'Get started'
		},
		{
			id: 'enterprise',
			name: 'Enterprise',
			price: 'Custom',
			description: 'Security & scale',
			features: ['SSO', 'Audit logs', 'SLA'],
			cta: 'Talk to us'
		}
	];

	const comparisonRows: PricingComparisonRow[] = [
		{ id: 'projects', label: 'Projects', values: ['3', 'Unlimited', 'Unlimited'] },
		{ id: 'components', label: 'All components', values: [false, true, true] },
		{ id: 'storybook', label: 'Storybook kit', values: [false, true, true] },
		{ id: 'sso', label: 'SSO', values: [false, false, true] },
		{ id: 'audit', label: 'Audit logs', values: [false, false, true] },
		{ id: 'support', label: 'Support', values: ['Community', 'Priority', 'Dedicated'] },
		{ id: 'sla', label: 'SLA', values: [false, false, true] }
	];

	const planSet = $derived(props.planSet ?? 'three');
	const plans = $derived(
		planSet === 'two'
			? two
			: planSet === 'four'
				? four
				: planSet === 'bento'
					? bentoPlans
					: three
	);

	let selectedId = $state('');
	let billingPeriod = $state<'monthly' | 'yearly'>('monthly');

	$effect(() => {
		if (props.selectedId) selectedId = props.selectedId;
	});

	const widthClass = $derived.by(() => {
		const layout = props.layout ?? 'grid';
		if (layout === 'vertical') return 'w-112 max-w-full';
		if (layout === 'table' || props.showComparison) return 'w-208 max-w-full';
		if (layout === 'horizontal') return 'w-192 max-w-full';
		if (layout === 'bento' || layout === 'split') return 'w-208 max-w-full';
		if ((props.columns ?? 3) >= 4 || planSet === 'four') return 'w-224 max-w-full';
		return 'w-192 max-w-full';
	});
</script>

<div class={['space-y-3 p-2', widthClass]}>
	<PricingTable
		{plans}
		layout={props.layout ?? 'grid'}
		columns={props.columns}
		bind:selectedId
		bind:billingPeriod
		showBillingToggle={props.showBillingToggle ?? false}
		showFeatures={props.showFeatures ?? true}
		showComparison={props.showComparison ?? false}
		maxFeatures={props.maxFeatures}
		comparisonRows={planSet === 'comparison' || props.layout === 'table' ? comparisonRows : undefined}
		onselect={(id) => (selectedId = id)}
	>
		{#snippet footer()}
			<Text size="xs" tone="muted">Prices in USD. Taxes may apply. Cancel anytime.</Text>
		{/snippet}
	</PricingTable>

	{#if selectedId}
		<p class="text-center text-xs text-muted">Selected: {selectedId}</p>
	{/if}
</div>
