<script lang="ts">
	import FieldArray from './FieldArray.svelte';
	import type { FieldArrayItem } from './FieldArray.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';

	let items = $state<FieldArrayItem[]>([
		{ id: '1', name: 'Alice', email: 'alice@acme.com' },
		{ id: '2', name: 'Bob', email: 'bob@acme.com' }
	]);
</script>

<div class="max-w-lg rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm font-semibold text-primary">Invite teammates</p>
	<FieldArray
		bind:items
		sortable
		min={1}
		max={8}
		addLabel="Add teammate"
		createItem={() => ({
			id: crypto.randomUUID(),
			name: '',
			email: ''
		})}
	>
		{#snippet item(row)}
			<div class="grid gap-2 sm:grid-cols-2">
				<Input
					label="Name"
					size="sm"
					placeholder="Full name"
					value={String(row.name ?? '')}
					oninput={(e) => {
						row.name = (e.currentTarget as HTMLInputElement).value;
						items = [...items];
					}}
				/>
				<Input
					label="Email"
					size="sm"
					type="email"
					placeholder="email@company.com"
					value={String(row.email ?? '')}
					oninput={(e) => {
						row.email = (e.currentTarget as HTMLInputElement).value;
						items = [...items];
					}}
				/>
			</div>
		{/snippet}
	</FieldArray>
</div>
