<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormRangeSlider from './FormRangeSlider.svelte';

	let data = $state({ range: [20, 80] as [number, number] });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormRangeSlider">
		<FormRangeSlider name="range" label="Price range" bindData />
	</Form>
</div>
