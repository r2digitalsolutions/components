<script lang="ts">
	import FormSection from './FormSection.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';

	let props = $props<{ title?: string; description?: string }>();
	let name = $state('Ada Lovelace');
	let email = $state('ada@example.com');
</script>

<div class="max-w-lg space-y-8 rounded-2xl border border-border bg-surface-elevated p-5">
	<FormSection
		title={props.title ?? 'Profile'}
		description={props.description ?? 'Public information shown on your profile.'}
	>
		<FormField label="Display name" bind:value={name} />
		<FormField label="Email" type="email" bind:value={email} />
		<FormActions submitLabel="Update profile" />
	</FormSection>
</div>
