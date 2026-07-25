<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormPasswordInput from './FormPasswordInput.svelte';

	let data = $state({ password: '' });
	let errors = $state<Record<string, string>>({
		password: 'Use at least 8 characters'
	});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormPasswordInput">
		<FormPasswordInput
			name="password"
			label="Password"
			helperText="At least 8 characters"
			bindData
			required
		/>
	</Form>
</div>
