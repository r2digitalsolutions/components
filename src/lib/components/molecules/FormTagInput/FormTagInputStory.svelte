<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormTagInput from './FormTagInput.svelte';

	let data = $state({ tags: [] as string[] });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormTagInput">
		<FormTagInput name="tags" label="Tags" bindData />
	</Form>
</div>
