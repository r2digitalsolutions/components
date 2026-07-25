<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormCombobox from './FormCombobox.svelte';

	let data = $state({ city: '' });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormCombobox">
		<FormCombobox
			name="city"
			label="City"
			options={[
				{ value: 'mad', label: 'Madrid' },
				{ value: 'bcn', label: 'Barcelona' },
				{ value: 'vlc', label: 'Valencia' }
			]}
			bindData
		/>
	</Form>
</div>
