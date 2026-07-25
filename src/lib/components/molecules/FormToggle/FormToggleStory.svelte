<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormToggle from './FormToggle.svelte';

	let data = $state({ public: true, notify: false });
	let errors = $state<Record<string, string>>({});
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="FormToggle">
		<FormToggle name="public" label="Public profile" helperText="Visible in search" bindData />
		<FormToggle name="notify" label="Email notifications" variant="plain" bindData />
	</Form>
</div>
