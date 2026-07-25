<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormDateTimePicker from './FormDateTimePicker.svelte';

	let data = $state({ meeting: '' });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormDateTimePicker">
		<FormDateTimePicker name="meeting" label="Meeting" bindData />
	</Form>
</div>
