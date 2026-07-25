<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormCheckboxGroup from './FormCheckboxGroup.svelte';

	let data = $state({ permissions: [] as string[] });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormCheckboxGroup">
		<FormCheckboxGroup
			name="permissions"
			label="Permissions"
			options={[
				{ value: 'read', label: 'Read' },
				{ value: 'write', label: 'Write' },
				{ value: 'delete', label: 'Delete' }
			]}
			bindData
		/>
	</Form>
</div>
