<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormTextarea from './FormTextarea.svelte';
	import FormSelect from '$lib/components/molecules/FormSelect/FormSelect.svelte';
	import FormCheckbox from '$lib/components/molecules/FormCheckbox/FormCheckbox.svelte';
	import FormToggle from '$lib/components/molecules/FormToggle/FormToggle.svelte';
	import FormPasswordInput from '$lib/components/molecules/FormPasswordInput/FormPasswordInput.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';

	let data = $state({
		bio: '',
		plan: '',
		password: '',
		newsletter: false,
		public: true
	});
</script>

<div class="max-w-md rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data title="Context-aware controls" description="All fields use bindData.">
		<FormTextarea name="bio" label="Bio" placeholder="Tell us about yourself" rows={3} bindData />
		<FormSelect
			name="plan"
			label="Plan"
			options={[
				{ value: 'free', label: 'Free' },
				{ value: 'pro', label: 'Pro' }
			]}
			bindData
		/>
		<FormPasswordInput name="password" label="Password" bindData />
		<FormCheckbox name="newsletter" label="Subscribe to newsletter" bindData />
		<FormToggle name="public" label="Public profile" helperText="Visible in search" bindData />
		{#snippet footer()}
			<FormActions variant="plain" showCancel={false} submitLabel="Save" />
		{/snippet}
	</Form>
</div>
