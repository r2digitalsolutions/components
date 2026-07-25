<script lang="ts">
	import ActionBar from './ActionBar.svelte';

	let props = $props<{ dirty?: boolean; loading?: boolean }>();
	let dirty = $state(true);
	$effect(() => {
		dirty = props.dirty ?? true;
	});
</script>

<div class="relative max-w-xl overflow-hidden rounded-2xl border border-border bg-surface">
	<div class="space-y-3 p-4">
		<p class="text-sm text-primary">Edit workspace settings</p>
		<p class="text-xs text-muted">Change a field to mark the form dirty, then save from the action bar.</p>
		<button
			type="button"
			class="text-xs font-medium text-brand-600 hover:underline"
			onclick={() => (dirty = !dirty)}
		>
			Toggle dirty state
		</button>
	</div>
	<ActionBar
		{dirty}
		loading={props.loading ?? false}
		onsubmit={() => (dirty = false)}
		oncancel={() => (dirty = false)}
	/>
</div>
