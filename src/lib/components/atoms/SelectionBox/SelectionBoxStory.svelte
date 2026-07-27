<script lang="ts">
	import SelectionBox from './SelectionBox.svelte';
	import type {
		SelectionBoxRadius,
		SelectionBoxSize,
		SelectionBoxTone
	} from './SelectionBox.svelte';

	let props = $props<{
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		size?: SelectionBoxSize;
		tone?: SelectionBoxTone;
		radius?: SelectionBoxRadius;
		label?: string;
		showLabel?: boolean;
		demo?: 'playground' | 'states' | 'sizes' | 'table';
	}>();

	const demo = $derived(props.demo ?? 'playground');
	let rowChecked = $state(false);
	let allChecked = $state(false);
	let someIndeterminate = $state(true);
	let rows = $state([
		{ id: '1042', title: 'Invoice #1042', meta: 'Acme Corp · $1,240.00', checked: true },
		{ id: '1043', title: 'Invoice #1043', meta: 'Globex · $890.00', checked: false },
		{ id: '1044', title: 'Invoice #1044', meta: 'Initech · $420.00', checked: false }
	]);

	$effect(() => {
		rowChecked = props.checked ?? false;
	});

	const sizes: SelectionBoxSize[] = ['sm', 'md', 'lg'];
	const tones: SelectionBoxTone[] = ['brand', 'primary', 'success'];

	function toggleAll(checked: boolean) {
		allChecked = checked;
		someIndeterminate = false;
		rows = rows.map((row) => ({ ...row, checked }));
	}

	function toggleRow(id: string, checked: boolean) {
		rows = rows.map((row) => (row.id === id ? { ...row, checked } : row));
		const selected = rows.filter((r) => r.checked).length;
		allChecked = selected === rows.length;
		someIndeterminate = selected > 0 && selected < rows.length;
	}
</script>

{#if demo === 'playground'}
	<div class="flex w-full max-w-md flex-col gap-2 rounded-xl border border-border bg-surface-elevated p-2">
		<div class="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-overlay">
			<SelectionBox
				bind:checked={rowChecked}
				indeterminate={props.indeterminate ?? false}
				disabled={props.disabled ?? false}
				size={props.size ?? 'md'}
				tone={props.tone ?? 'brand'}
				radius={props.radius ?? 'sm'}
				label={props.label ?? 'Select row'}
				showLabel={props.showLabel ?? false}
			/>
			<div class="min-w-0 flex-1">
				<p class="truncate text-sm font-medium text-primary">Invoice #1042</p>
				<p class="truncate text-xs text-muted">Acme Corp · $1,240.00</p>
			</div>
		</div>
		<div class="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-overlay">
			<SelectionBox
				size={props.size ?? 'md'}
				tone={props.tone ?? 'brand'}
				radius={props.radius ?? 'sm'}
				label="Select row"
			/>
			<div class="min-w-0 flex-1">
				<p class="truncate text-sm font-medium text-primary">Invoice #1043</p>
				<p class="truncate text-xs text-muted">Globex · $890.00</p>
			</div>
		</div>
	</div>
{:else if demo === 'states'}
	<div class="flex flex-col gap-3">
		<div class="flex flex-wrap items-center gap-4">
			<SelectionBox checked label="Checked" showLabel />
			<SelectionBox indeterminate label="Indeterminate" showLabel />
			<SelectionBox disabled label="Disabled" showLabel />
			<SelectionBox checked disabled label="Checked disabled" showLabel />
		</div>
		<div class="flex flex-wrap items-center gap-4">
			{#each tones as tone (tone)}
				<SelectionBox checked {tone} label={tone} showLabel />
			{/each}
		</div>
		<div class="flex flex-wrap items-center gap-4">
			<SelectionBox checked radius="none" label="square" showLabel />
			<SelectionBox checked radius="sm" label="rounded" showLabel />
			<SelectionBox checked radius="md" size="lg" label="soft" showLabel />
		</div>
	</div>
{:else if demo === 'sizes'}
	<div class="flex flex-col gap-3">
		{#each sizes as size (size)}
			<div class="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
				<SelectionBox {size} checked label={`Size ${size}`} showLabel />
			</div>
		{/each}
	</div>
{:else}
	<div class="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface-elevated">
		<div class="flex items-center gap-3 border-b border-border bg-surface-overlay px-3 py-2">
			<SelectionBox
				checked={allChecked}
				indeterminate={someIndeterminate}
				label="Select all"
				onchange={toggleAll}
			/>
			<span class="text-xs font-medium uppercase tracking-wide text-muted">Invoices</span>
			<span class="ml-auto text-xs text-muted"
				>{rows.filter((r) => r.checked).length} selected</span
			>
		</div>
		{#each rows as row (row.id)}
			<div class="flex items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0 hover:bg-surface-overlay/60">
				<SelectionBox
					checked={row.checked}
					label={`Select ${row.title}`}
					tone="brand"
					onchange={(checked) => toggleRow(row.id, checked)}
				/>
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-primary">{row.title}</p>
					<p class="truncate text-xs text-muted">{row.meta}</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
