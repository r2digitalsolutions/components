<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormNumberInput from './FormNumberInput.svelte';

	let data = $state({ seats: 1 });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormNumberInput">
		<FormNumberInput name="seats" label="Seats" min={1} max={50} bindData />
	</Form>
</div>
