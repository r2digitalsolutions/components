<script lang="ts">
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import Slider from '$lib/components/atoms/Slider/Slider.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import {
		type GridDensity,
		GRID_DENSITY
	} from '$lib/utils/layoutGrid.js';
	import Grid3x3 from '@lucide/svelte/icons/grid-3x3';
	import Lock from '@lucide/svelte/icons/lock';
	import Unlock from '@lucide/svelte/icons/unlock';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	export type { GridDensity };

	interface DashboardGridToolbarProps {
		cols?: number;
		rowHeight?: number;
		gap?: number;
		compact?: boolean;
		editable?: boolean;
		showGrid?: boolean;
		density?: GridDensity | 'custom';
		colOptions?: number[];
		class?: string;
		onreset?: () => void;
		oncompact?: () => void;
		onchange?: (next: {
			cols: number;
			rowHeight: number;
			gap: number;
			compact: boolean;
			editable: boolean;
			showGrid: boolean;
			density: GridDensity | 'custom';
		}) => void;
	}

	let {
		cols = $bindable(12),
		rowHeight = $bindable(80),
		gap = $bindable(12),
		compact = $bindable(true),
		editable = $bindable(true),
		showGrid = $bindable(true),
		density = $bindable<GridDensity | 'custom'>('default'),
		colOptions = [6, 8, 12, 16, 24],
		class: className = '',
		onreset,
		oncompact,
		onchange
	}: DashboardGridToolbarProps = $props();

	const colSelect = $derived(String(cols));

	const densityItems = [
		{ id: 'comfortable', label: 'Airy' },
		{ id: 'default', label: 'Default' },
		{ id: 'compact', label: 'Compact' },
		{ id: 'dense', label: 'Dense' }
	];

	function emit() {
		onchange?.({ cols, rowHeight, gap, compact, editable, showGrid, density });
	}

	function applyDensity(id: string) {
		const key = id as GridDensity;
		const preset = GRID_DENSITY[key];
		if (!preset) return;
		density = key;
		cols = preset.cols;
		rowHeight = preset.rowHeight;
		gap = preset.gap;
		emit();
	}

	function setCols(value: string) {
		const next = Number(value);
		if (!Number.isFinite(next) || next <= 0) return;
		cols = next;
		density = 'custom';
		emit();
	}

	function setRowHeight(value: number) {
		rowHeight = value;
		density = 'custom';
		emit();
	}

	function setGap(value: number) {
		gap = value;
		density = 'custom';
		emit();
	}
</script>

<div
	class={[
		'flex flex-col gap-3 rounded-xl border border-border bg-surface-elevated p-3 sm:p-4',
		className
	]}
>
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Button
				size="sm"
				variant={editable ? 'primary' : 'secondary'}
				onclick={() => {
					editable = !editable;
					emit();
				}}
			>
				{#if editable}
					<Unlock class="h-3.5 w-3.5" strokeWidth={2} />
					Editing
				{:else}
					<Lock class="h-3.5 w-3.5" strokeWidth={2} />
					Locked
				{/if}
			</Button>
			<Button
				size="sm"
				variant={showGrid ? 'secondary' : 'ghost'}
				onclick={() => {
					showGrid = !showGrid;
					emit();
				}}
			>
				<Grid3x3 class="h-3.5 w-3.5" strokeWidth={2} />
				Grid
			</Button>
			{#if oncompact}
				<Button size="sm" variant="ghost" onclick={() => oncompact?.()}>Compact</Button>
			{/if}
			{#if onreset}
				<Button size="sm" variant="ghost" onclick={() => onreset?.()}>
					<RotateCcw class="h-3.5 w-3.5" strokeWidth={2} />
					Reset
				</Button>
			{/if}
		</div>

		<label class="flex items-center gap-2 text-xs text-secondary">
			<input
				type="checkbox"
				class="rounded border-border"
				bind:checked={compact}
				onchange={() => emit()}
			/>
			Auto-compact
		</label>
	</div>

	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)_minmax(0,1fr)]">
		<div class="min-w-0 space-y-1.5">
			<p class="text-[11px] font-medium text-muted">Density</p>
			<SegmentedControl
				items={densityItems}
				value={density === 'custom' ? '' : density}
				size="sm"
				fullWidth
				onchange={applyDensity}
			/>
		</div>

		<Select
			label="Columns"
			size="sm"
			value={colSelect}
			options={colOptions.map((n) => ({ value: String(n), label: `${n} cols` }))}
			onchange={setCols}
		/>

		<Slider
			label="Row height"
			size="sm"
			min={40}
			max={140}
			step={4}
			bind:value={rowHeight}
			unit="px"
			valuePosition="header"
			oninput={setRowHeight}
			onchange={setRowHeight}
		/>

		<Slider
			label="Gap"
			size="sm"
			min={0}
			max={32}
			step={2}
			bind:value={gap}
			unit="px"
			valuePosition="header"
			oninput={setGap}
			onchange={setGap}
		/>
	</div>

	<p class="text-[11px] tabular-nums text-muted">
		{cols}× · row {rowHeight}px · gap {gap}px
		{#if density === 'custom'}
			· custom
		{/if}
	</p>
</div>
