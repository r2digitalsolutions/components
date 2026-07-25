<script lang="ts">
	import FieldArray from './FieldArray.svelte';
	import type { FieldArrayItem } from './FieldArray.svelte';
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import type { FormErrors } from '$lib/utils/formContext.js';

	type InviteForm = {
		team: string;
		teammates: FieldArrayItem[];
	};

	let data = $state<InviteForm>({
		team: 'Platform',
		teammates: [
			{ id: '1', name: 'Alice', email: 'alice@acme.com' },
			{ id: '2', name: 'Bob', email: 'bob@acme.com' }
		]
	});
	let errors = $state<FormErrors>({});
	let saved = $state('');

	function validate() {
		const next: FormErrors = {};
		if (!data.team.trim()) next.team = 'Team is required';
		if (!data.teammates.length) next.teammates = 'Add at least one teammate';
		data.teammates.forEach((row, i) => {
			if (!String(row.name ?? '').trim()) next[`teammates.${i}.name`] = 'Name is required';
			if (!String(row.email ?? '').trim()) next[`teammates.${i}.email`] = 'Email is required';
		});
		errors = next;
		return Object.keys(next).length === 0;
	}

	function submit() {
		if (!validate()) return;
		saved = JSON.stringify(data, null, 2);
	}
</script>

<div class="max-w-lg rounded-2xl border border-border bg-surface-elevated p-4">
	<Form bind:data bind:errors title="Invite teammates" onsubmit={submit}>
		<FormField name="team" label="Team" bindData required />

		<FieldArray
			name="teammates"
			bindData
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
			{#snippet item(row, _index, meta)}
				<div class="grid gap-2 sm:grid-cols-2">
					<FormField
						name={meta.path('name')}
						label="Name"
						size="sm"
						placeholder="Full name"
						value={String(row.name ?? '')}
						errorMessage={meta.getError('name')}
						disabled={meta.disabled}
						oninput={(e) => {
							row.name = (e.currentTarget as HTMLInputElement).value;
							data = { ...data, teammates: [...data.teammates] };
						}}
					/>
					<FormField
						name={meta.path('email')}
						label="Email"
						size="sm"
						type="email"
						placeholder="email@company.com"
						value={String(row.email ?? '')}
						errorMessage={meta.getError('email')}
						disabled={meta.disabled}
						oninput={(e) => {
							row.email = (e.currentTarget as HTMLInputElement).value;
							data = { ...data, teammates: [...data.teammates] };
						}}
					/>
				</div>
			{/snippet}
		</FieldArray>

		{#snippet footer()}
			<FormActions submitLabel="Send invites" variant="plain" showCancel={false} />
		{/snippet}
	</Form>

	{#if saved}
		<pre class="mt-4 overflow-auto rounded-lg bg-surface-overlay p-3 text-[11px] text-secondary">{saved}</pre>
	{/if}
</div>
