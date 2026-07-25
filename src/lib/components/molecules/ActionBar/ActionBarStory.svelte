<script lang="ts">
	import ActionBar from './ActionBar.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let props = $props<{ dirty?: boolean; loading?: boolean; variant?: 'dock' | 'inline' }>();

	let name = $state('Acme Workspace');
	let dirty = $state(true);
	let baseline = 'Acme Workspace';

	$effect(() => {
		if (props.dirty !== undefined) dirty = props.dirty;
	});

	$effect(() => {
		dirty = name !== baseline;
	});
</script>

<div class="relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
	<div class="space-y-4 p-5 pb-16">
		<div>
			<p class="text-sm font-semibold text-primary">Workspace settings</p>
			<Text size="xs" tone="muted" class="mt-0.5">
				Edit the name — the action bar tracks unsaved state.
			</Text>
		</div>
		<Input size="sm" label="Name" bind:value={name} />
	</div>

	<ActionBar
		{dirty}
		loading={props.loading ?? false}
		variant={props.variant ?? 'dock'}
		onsubmit={() => {
			baseline = name;
			dirty = false;
		}}
		oncancel={() => {
			name = baseline;
			dirty = false;
		}}
	/>
</div>
