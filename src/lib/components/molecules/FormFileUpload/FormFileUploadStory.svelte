<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormFileUpload from './FormFileUpload.svelte';

	let data = $state({ attachments: [] as File[] });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-md rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormFileUpload">
		<FormFileUpload
			name="attachments"
			label="Attachments"
			accept="image/*,.pdf"
			maxFiles={3}
			bindData
		/>
	</Form>
</div>
