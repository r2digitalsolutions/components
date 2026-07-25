<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormGroup from './FormGroup.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';

	let data = $state({ first: '', last: '' });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormGroup">
		<FormGroup legend="Name" description="Personal details" variant="inset">
			<FormField name="first" label="First name" bindData />
			<FormField name="last" label="Last name" bindData />
		</FormGroup>
	</Form>
</div>
