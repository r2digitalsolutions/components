<script lang="ts">
	import PricingTable from '$lib/components/organisms/PricingTable/PricingTable.svelte';
	import type { PricingPlan } from '$lib/components/organisms/PricingTable/PricingTable.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	interface CheckoutPageProps {
		plans?: PricingPlan[];
		selectedPlanId?: string;
		loading?: boolean;
		class?: string;
		onselect?: (id: string) => void;
		onsubmit?: (payload: {
			planId: string;
			name: string;
			email: string;
			company: string;
		}) => void;
	}

	let {
		plans = [
			{
				id: 'starter',
				name: 'Starter',
				price: '$12',
				period: '/mo',
				description: 'For solo builders',
				features: ['3 projects', 'Basic analytics', 'Email support'],
				cta: 'Choose Starter'
			},
			{
				id: 'pro',
				name: 'Pro',
				price: '$29',
				period: '/mo',
				description: 'For growing teams',
				features: ['Unlimited projects', 'Advanced analytics', 'Priority support'],
				cta: 'Choose Pro',
				featured: true
			},
			{
				id: 'business',
				name: 'Business',
				price: '$79',
				period: '/mo',
				description: 'For larger orgs',
				features: ['SSO', 'Audit logs', 'Dedicated CSM'],
				cta: 'Choose Business'
			}
		],
		selectedPlanId = $bindable('pro'),
		loading = false,
		class: className = '',
		onselect,
		onsubmit
	}: CheckoutPageProps = $props();

	let name = $state('');
	let email = $state('');
	let company = $state('');

	const selected = $derived(plans.find((p) => p.id === selectedPlanId));

	function handleSelect(id: string) {
		selectedPlanId = id;
		onselect?.(id);
	}

	function submit() {
		if (!selectedPlanId) return;
		onsubmit?.({ planId: selectedPlanId, name, email, company });
	}
</script>

<div class={['mx-auto w-full max-w-5xl space-y-8', className]}>
	<PageHeader
		title="Choose your plan"
		description="Pick a plan and complete billing details to continue."
	/>

	<PricingTable {plans} bind:selectedId={selectedPlanId} onselect={handleSelect} />

	{#if selected}
		<Alert variant="info" title="Selected plan" message={`${selected.name} · ${selected.price}${selected.period ?? ''}`} />
	{/if}

	<Card padding="lg" chrome={false}>
		<FormSection title="Billing details" description="We’ll use this for invoices and receipts.">
			<Stack gap="md">
				<div class="grid gap-3 sm:grid-cols-2">
					<FormField label="Full name" bind:value={name} required placeholder="Ada Lovelace" />
					<FormField label="Work email" type="email" bind:value={email} required placeholder="ada@company.com" />
				</div>
				<FormField label="Company" bind:value={company} placeholder="Analytical Engines Ltd" />
				<FormActions
					submitLabel="Continue to payment"
					cancelLabel="Back"
					{loading}
					showCancel={false}
					align="end"
					onsubmit={submit}
				/>
			</Stack>
		</FormSection>
	</Card>
</div>
