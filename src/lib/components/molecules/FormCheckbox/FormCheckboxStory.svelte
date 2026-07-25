<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormCheckbox from './FormCheckbox.svelte';
	import FormToggle from '$lib/components/molecules/FormToggle/FormToggle.svelte';
	import FormPasswordInput from '$lib/components/molecules/FormPasswordInput/FormPasswordInput.svelte';

	let data = $state({ terms: false, dark: true, password: '' });
	let errors = $state<Record<string, string>>({
		terms: 'You must accept the terms'
	});
</script>

<div class="max-w-sm space-y-4 rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="Boolean + password">
		<FormCheckbox name="terms" label="I agree to the terms" bindData />
		<FormToggle name="dark" label="Dark mode" helperText="Applies immediately" bindData />
		<FormPasswordInput name="password" label="Password" helperText="Min 8 characters" bindData />
	</Form>
</div>
