<script lang="ts">
	import FormWizard from './FormWizard.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';

	let data = $state({ name: '', email: '', plan: '' });
	let errors = $state<Record<string, string>>({});
	let current = $state(0);
</script>

<div class="max-w-xl rounded-2xl border border-border bg-surface-elevated p-4">
	<FormWizard
		bind:data
		bind:errors
		bind:current
		title="FormWizard"
		steps={[
			{ id: 'profile', label: 'Profile', description: 'Basic info' },
			{ id: 'contact', label: 'Contact', description: 'Email' },
			{ id: 'plan', label: 'Plan', description: 'Choose plan' }
		]}
		onfinish={() => alert(JSON.stringify(data))}
	>
		{#snippet children(index)}
			{#if index === 0}
				<FormField name="name" label="Name" bindData />
			{:else if index === 1}
				<FormField name="email" label="Email" type="email" bindData />
			{:else}
				<FormField name="plan" label="Plan" bindData />
			{/if}
		{/snippet}
	</FormWizard>
</div>
