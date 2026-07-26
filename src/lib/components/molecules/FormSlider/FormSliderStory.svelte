<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormSlider from './FormSlider.svelte';

	let data = $state({ volume: 40 });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormSlider">
		<FormSlider name="volume" label="Volume" bindData />
	</Form>
</div>
