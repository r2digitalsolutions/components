<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormDateRangePicker from './FormDateRangePicker.svelte';

	let data = $state({ range: { start: '', end: '' } });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-md rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormDateRangePicker">
		<FormDateRangePicker name="range" label="Date range" bindData />
	</Form>
</div>
