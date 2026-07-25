<script lang="ts">
	import UnsavedChanges from './UnsavedChanges.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';

	let {
		variant = 'floating'
	}: {
		variant?: 'floating' | 'inline';
	} = $props();

	let dirty = $state(true);
	let saving = $state(false);

	function save() {
		saving = true;
		setTimeout(() => {
			saving = false;
			dirty = false;
		}, 900);
	}
</script>

<div class="relative w-full max-w-xl space-y-4">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Unsaved changes</p>
		<p class="text-xs text-secondary">
			{#if variant === 'floating'}
				Dock inferior tipo Notion/Linear. También bloquea el cierre de pestaña.
			{:else}
				Alerta inline dentro del layout del formulario.
			{/if}
		</p>
	</div>

	<div class="rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm">
		<div class="flex items-center justify-between gap-3">
			<div>
				<p class="text-sm font-medium text-primary">Project settings</p>
				<p class="text-xs text-muted">Toggle dirty to show the bar.</p>
			</div>
			<Toggle bind:checked={dirty} label="Dirty" />
		</div>
		<div class="mt-4 space-y-2">
			<div class="h-9 rounded-lg border border-border bg-surface px-3 text-sm leading-9 text-muted">
				Acme Workspace
			</div>
			<div class="h-20 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted">
				Notes…
			</div>
		</div>
	</div>

	{#if variant === 'inline'}
		<UnsavedChanges
			{dirty}
			{variant}
			{saving}
			onsave={save}
			ondiscard={() => (dirty = false)}
		/>
	{:else}
		<!-- Extra height so the floating bar doesn't cover the demo -->
		<div class="h-16" aria-hidden="true"></div>
		<UnsavedChanges
			{dirty}
			variant="floating"
			{saving}
			onsave={save}
			ondiscard={() => (dirty = false)}
		/>
	{/if}
</div>
