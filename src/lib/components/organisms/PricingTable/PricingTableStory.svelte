<script lang="ts">
	import PricingTable, { type PricingPlan } from './PricingTable.svelte';

	const plans: PricingPlan[] = [
		{
			id: 'free',
			name: 'Free',
			price: '$0',
			period: 'mo',
			description: 'For side projects',
			features: ['Up to 3 projects', 'Community support', 'Basic components']
		},
		{
			id: 'pro',
			name: 'Pro',
			price: '$29',
			period: 'mo',
			description: 'For growing teams',
			featured: true,
			features: ['Unlimited projects', 'Priority support', 'All components', 'Storybook kit'],
			cta: 'Start Pro'
		},
		{
			id: 'enterprise',
			name: 'Enterprise',
			price: 'Custom',
			description: 'For large orgs',
			features: ['SSO & audit logs', 'Dedicated support', 'Custom theming', 'SLA'],
			cta: 'Contact sales'
		}
	];
</script>

<PricingTable {plans} class="max-w-4xl" />
