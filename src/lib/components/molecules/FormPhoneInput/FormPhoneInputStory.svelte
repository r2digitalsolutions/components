<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormPhoneInput from './FormPhoneInput.svelte';

	let data = $state({ phone: '' });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormPhoneInput">
		<FormPhoneInput name="phone" bindData />
	</Form>
</div>
