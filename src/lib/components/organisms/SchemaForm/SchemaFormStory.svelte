<script lang="ts">
	import SchemaForm from './SchemaForm.svelte';
	import type { SchemaField, SchemaFormValues } from './SchemaForm.svelte';

	const schema: SchemaField[] = [
		{
			name: 'name',
			label: 'Workspace name',
			type: 'text',
			required: true,
			placeholder: 'Acme Inc',
			section: 'General'
		},
		{
			name: 'slug',
			label: 'Slug',
			type: 'text',
			placeholder: 'acme',
			helperText: 'Used in URLs'
		},
		{
			name: 'plan',
			label: 'Plan',
			type: 'select',
			section: 'Billing',
			options: [
				{ value: 'free', label: 'Free' },
				{ value: 'pro', label: 'Pro' },
				{ value: 'enterprise', label: 'Enterprise' }
			],
			defaultValue: 'pro'
		},
		{
			name: 'notes',
			label: 'Notes',
			type: 'textarea',
			placeholder: 'Internal notes…'
		},
		{
			name: 'public',
			label: 'Public workspace',
			type: 'toggle',
			helperText: 'Anyone with the link can view',
			section: 'Access',
			defaultValue: false
		},
		{
			name: 'terms',
			label: 'I agree to the terms',
			type: 'checkbox',
			required: true
		}
	];

	let values = $state<SchemaFormValues>({});
	let saved = $state('');
</script>

<div class="max-w-md rounded-2xl border border-border bg-surface-elevated p-5">
	<SchemaForm
		{schema}
		bind:values
		title="Create workspace"
		description="Configure your team workspace."
		submitLabel="Create"
		onsubmit={(v) => (saved = JSON.stringify(v, null, 2))}
	/>
	{#if saved}
		<pre class="mt-4 overflow-auto rounded-lg bg-surface-overlay p-3 text-[11px] text-secondary">{saved}</pre>
	{/if}
</div>
