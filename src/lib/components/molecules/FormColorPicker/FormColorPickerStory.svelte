<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormColorPicker from './FormColorPicker.svelte';

	let data = $state({ color: '#6366f1' });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormColorPicker">
		<FormColorPicker name="color" label="Brand color" bindData />
	</Form>
</div>
