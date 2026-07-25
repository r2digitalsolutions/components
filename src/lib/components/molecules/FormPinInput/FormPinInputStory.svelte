<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormPinInput from './FormPinInput.svelte';

	let data = $state({ code: '' });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormPinInput">
		<FormPinInput name="code" label="Verification code" length={6} bindData />
	</Form>
</div>
