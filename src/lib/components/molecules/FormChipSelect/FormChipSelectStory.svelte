<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormChipSelect from './FormChipSelect.svelte';

	let data = $state({ topics: [] as string[] });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormChipSelect">
		<FormChipSelect
			name="topics"
			label="Topics"
			options={[
				{ id: 'design', label: 'Design' },
				{ id: 'eng', label: 'Engineering' },
				{ id: 'sales', label: 'Sales' }
			]}
			bindData
		/>
	</Form>
</div>
