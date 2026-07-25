<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormRadioGroup from './FormRadioGroup.svelte';

	let data = $state({ plan: '' });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormRadioGroup">
		<FormRadioGroup
			name="plan"
			label="Plan"
			options={[
				{ value: 'free', label: 'Free' },
				{ value: 'pro', label: 'Pro' }
			]}
			bindData
		/>
	</Form>
</div>
