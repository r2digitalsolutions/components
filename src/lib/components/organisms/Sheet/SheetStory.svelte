<script lang="ts">
	import Sheet, { type SheetSize, type SheetAccent } from './Sheet.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		title?: string;
		description?: string;
		size?: SheetSize;
		accent?: SheetAccent | string;
		draggable?: boolean;
		pullToClose?: boolean;
		showHandle?: boolean;
		showClose?: boolean;
		showSnaps?: boolean;
		borderTop?: boolean;
	}>();

	let open = $state(false);
	let snapIndex = $state(0);
	let size = $state<SheetSize>('lg');
	let accent = $state<SheetAccent | string>('brand');

	$effect(() => {
		if (props.size) size = props.size;
	});
	$effect(() => {
		if (props.accent) accent = props.accent;
	});
</script>

<div class="space-y-3">
	<div class="flex flex-wrap gap-2">
		<Button size="sm" onclick={() => (open = true)}>Open sheet</Button>
		{#each (['sm', 'md', 'lg', 'xl', 'full'] as SheetSize[]) as s}
			<Button
				size="sm"
				variant={size === s ? 'primary' : 'secondary'}
				onclick={() => {
					size = s;
					snapIndex = 0;
					open = true;
				}}
			>
				{s}
			</Button>
		{/each}
	</div>

	<p class="text-xs text-secondary">
		Drag the handle, tap snap dots, or pull down to close. Current snap: {snapIndex}
	</p>

	<Sheet
		bind:open
		bind:snapIndex
		{size}
		{accent}
		title={props.title ?? 'Workout details'}
		description={props.description ?? 'Drag between breakpoints or pull to dismiss.'}
		draggable={props.draggable ?? true}
		pullToClose={props.pullToClose ?? true}
		showHandle={props.showHandle ?? true}
		showClose={props.showClose ?? true}
		showSnaps={props.showSnaps ?? true}
		borderTop={props.borderTop ?? true}
		snaps={size === 'xl' ? [0.32, 0.55, 0.88] : undefined}
	>
		{#snippet actions()}
			<Button size="sm" variant="ghost" data-no-drag>Edit</Button>
		{/snippet}

		<div class="space-y-3">
			<p>
				Sheet with <strong>accent</strong>, <strong>snap breakpoints</strong>, header
				<strong> actions</strong>, scrollable body and sticky footer.
			</p>
			{#each Array.from({ length: 12 }, (_, i) => i + 1) as n}
				<div class="rounded-xl border border-border bg-surface px-3 py-2.5">
					<p class="text-sm font-medium text-primary">Section {n}</p>
					<p class="text-xs text-secondary">Scrollable content inside the sheet body.</p>
				</div>
			{/each}
		</div>

		{#snippet footer()}
			<div class="flex justify-end gap-2">
				<Button size="sm" variant="ghost" onclick={() => (open = false)}>Cancel</Button>
				<Button size="sm" onclick={() => (open = false)}>Save</Button>
			</div>
		{/snippet}
	</Sheet>
</div>
