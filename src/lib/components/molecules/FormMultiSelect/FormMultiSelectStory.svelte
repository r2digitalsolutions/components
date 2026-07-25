<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormMultiSelect from './FormMultiSelect.svelte';

	let data = $state({ roles: [] as string[] });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormMultiSelect">
		<FormMultiSelect
			name="roles"
			label="Roles"
			options={[
				{ value: 'admin', label: 'Admin' },
				{ value: 'editor', label: 'Editor' },
				{ value: 'viewer', label: 'Viewer' }
			]}
			bindData
		/>
	</Form>
</div>
