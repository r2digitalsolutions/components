<script lang="ts">
	import FormActions from './FormActions.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';

	let {
		variant = 'bar',
		align = 'end',
		loading = false,
		example = 'default'
	}: {
		variant?: 'plain' | 'bar' | 'sticky';
		align?: 'start' | 'end' | 'between';
		loading?: boolean;
		example?: 'default' | 'danger' | 'hint';
	} = $props();

	let last = $state('');
	let name = $state('Acme Workspace');
</script>

<div class="w-full max-w-lg space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Form actions</p>
		<p class="text-xs text-secondary">
			Footer de formulario: bar / sticky / plain, con cancel, save y acción destructiva opcional.
		</p>
	</div>

	<div
		class={[
			'flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
			variant === 'sticky' && 'max-h-[22rem]'
		]}
	>
		<div
			class={[
				'min-h-0 space-y-4 p-4 sm:p-5',
				variant === 'sticky' && 'flex-1 overflow-y-auto overscroll-contain'
			]}
		>
			<div>
				<p class="text-sm font-semibold text-primary">Workspace settings</p>
				<p class="mt-0.5 text-xs text-muted">Update how this workspace appears.</p>
			</div>

			<FormField label="Name" name="name" bind:value={name} />

			{#if variant === 'sticky'}
				{#each Array(8) as _, i}
					<div
						class="rounded-xl border border-dashed border-border px-3 py-4 text-xs text-muted"
					>
						Scrollable section {i + 1}
					</div>
				{/each}
			{/if}
		</div>

		<FormActions
			variant={variant === 'sticky' ? 'sticky' : variant}
			{align}
			{loading}
			submitLabel="Save changes"
			cancelLabel="Cancel"
			dangerLabel={example === 'danger' ? 'Delete workspace' : undefined}
			hint={example === 'hint' ? 'Last saved 2 minutes ago' : ''}
			class={variant === 'sticky' ? 'shrink-0' : ''}
			onsubmit={() => (last = 'submit')}
			oncancel={() => (last = 'cancel')}
			ondanger={() => (last = 'danger')}
		/>
	</div>

	{#if last}
		<p class="font-mono text-[11px] text-muted">Last action: {last}</p>
	{/if}
</div>
