<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormRating from './FormRating.svelte';

	let data = $state({ rating: 0 });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormRating">
		<FormRating name="rating" label="Rating" bindData />
	</Form>
</div>
