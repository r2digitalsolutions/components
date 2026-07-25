<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import Label from '$lib/components/atoms/Label/Label.svelte';
	import ChipSelect from '$lib/components/molecules/ChipSelect/ChipSelect.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';

	interface ContactFormProps {
		title?: string;
		subtitle?: string;
		loading?: boolean;
		class?: string;
		onsubmit?: (payload: {
			name: string;
			email: string;
			topics: string[];
			message: string;
		}) => void;
	}

	let {
		title = 'Contact us',
		subtitle = 'Tell us how we can help — we usually reply within one business day.',
		loading = false,
		class: className = '',
		onsubmit
	}: ContactFormProps = $props();

	let name = $state('');
	let email = $state('');
	let topics = $state<string[]>(['sales']);
	let message = $state('');

	function submit() {
		onsubmit?.({ name, email, topics, message });
	}
</script>

<Card class={`w-full max-w-lg ${className}`} padding="lg" chrome={false}>
	<div class="mb-5 space-y-1">
		<Heading level={2} size="xl">{title}</Heading>
		<p class="text-sm text-muted">{subtitle}</p>
	</div>

	<FormSection title="Your details" divided={false}>
		<div class="space-y-4">
			<div class="grid gap-3 sm:grid-cols-2">
				<FormField label="Name" bind:value={name} required placeholder="Alex Rivera" />
				<FormField label="Email" type="email" bind:value={email} required placeholder="you@company.com" />
			</div>

			<ChipSelect
				label="Topic"
				multiple={false}
				bind:value={topics}
				options={[
					{ id: 'sales', label: 'Sales' },
					{ id: 'support', label: 'Support' },
					{ id: 'partnership', label: 'Partnership' },
					{ id: 'other', label: 'Other' }
				]}
			/>

			<div class="space-y-1.5">
				<Label>Message</Label>
				<Textarea bind:value={message} rows={5} placeholder="How can we help?" required />
			</div>

			<FormActions
				submitLabel="Send message"
				showCancel={false}
				{loading}
				align="end"
				onsubmit={submit}
			/>
		</div>
	</FormSection>
</Card>
