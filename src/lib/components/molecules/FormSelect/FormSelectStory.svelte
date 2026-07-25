<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormSelect from './FormSelect.svelte';

	let data = $state({ country: '' });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormSelect">
		<FormSelect
			name="country"
			label="Country"
			placeholder="Choose…"
			options={[
				{ value: 'es', label: 'Spain' },
				{ value: 'pt', label: 'Portugal' },
				{ value: 'mx', label: 'Mexico' }
			]}
			bindData
			required
		/>
	</Form>
</div>
