<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Descriptions from '$lib/components/molecules/Descriptions/Descriptions.svelte';
	import PromoCard from '$lib/components/molecules/PromoCard/PromoCard.svelte';
	import FeatureList from '$lib/components/molecules/FeatureList/FeatureList.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';

	interface BillingPageProps {
		planName?: string;
		price?: string;
		period?: string;
		renewalDate?: string;
		seats?: string;
		status?: 'active' | 'past_due' | 'canceled';
		class?: string;
		onupgrade?: () => void;
		onmanage?: () => void;
		oncancel?: () => void;
	}

	const {
		planName = 'Pro',
		price = '$29',
		period = '/mo',
		renewalDate = 'Aug 25, 2026',
		seats = '8 seats',
		status = 'active',
		class: className = '',
		onupgrade,
		onmanage,
		oncancel
	}: BillingPageProps = $props();

	const statusVariant = {
		active: 'success',
		past_due: 'warning',
		canceled: 'error'
	} as const;
</script>

<div class={['w-full space-y-6', className]}>
	<PageHeader
		title="Billing"
		description="Manage your subscription, invoices, and payment method."
	>
		{#snippet actions()}
			<Button size="sm" variant="secondary" onclick={() => onmanage?.()}>Manage payment</Button>
			<Button size="sm" onclick={() => onupgrade?.()}>Upgrade</Button>
		{/snippet}
	</PageHeader>

	{#if status === 'past_due'}
		<Alert
			variant="warning"
			title="Payment past due"
			message="Update your payment method to keep Pro features active."
		/>
	{/if}

	<div class="grid gap-4 lg:grid-cols-5">
		<Card class="lg:col-span-3" padding="lg" chrome={false}>
			<div class="mb-4 flex items-center gap-2">
				<p class="text-sm font-semibold text-primary">Current plan</p>
				<Badge size="sm" variant={statusVariant[status]}>{status.replace('_', ' ')}</Badge>
			</div>
			<Descriptions
				bordered={false}
				items={[
					{ label: 'Plan', value: planName },
					{ label: 'Price', value: `${price}${period}` },
					{ label: 'Seats', value: seats },
					{ label: 'Renews', value: renewalDate }
				]}
			/>
			<div class="mt-4">
				<FormActions
					submitLabel="Change plan"
					cancelLabel="Cancel subscription"
					align="between"
					onsubmit={() => onupgrade?.()}
					oncancel={() => oncancel?.()}
				/>
			</div>
		</Card>

		<div class="space-y-4 lg:col-span-2">
			<PromoCard
				eyebrow="Save 20%"
				badge="Annual"
				title="Switch to yearly billing"
				description="Lock in a lower rate and get two months free."
				actionLabel="Switch to yearly"
				onaction={() => onupgrade?.()}
			/>
			<Card padding="lg" chrome={false}>
				<FeatureList
					title="Included in Pro"
					items={[
						{ id: '1', title: 'Unlimited projects', icon: 'check' },
						{ id: '2', title: 'Advanced analytics', icon: 'bolt' },
						{ id: '3', title: 'Priority support', icon: 'shield' }
					]}
				/>
			</Card>
		</div>
	</div>
</div>
