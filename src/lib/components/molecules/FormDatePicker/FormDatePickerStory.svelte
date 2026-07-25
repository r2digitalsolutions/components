<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormDatePicker from './FormDatePicker.svelte';

	let data = $state({ start: '' });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormDatePicker">
		<FormDatePicker name="start" label="Start date" bindData />
	</Form>
</div>
