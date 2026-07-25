<script lang="ts">
	import FormError from './FormError.svelte';
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import type { FormErrors } from '$lib/utils/formContext.js';

	let errors = $state<FormErrors>({
		_form: 'Something went wrong. Please try again.',
		email: 'Email is already taken'
	});
</script>

<div class="max-w-sm space-y-4 rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="text-sm font-semibold text-primary">FormError</p>
	<Form bind:errors title="Profile">
		<FormError />
		<FormField name="email" label="Email" bindData />
		<FormError name="email" />
		<FormError message="Inline override message" />
	</Form>
</div>
