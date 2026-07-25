<script lang="ts">
	import Heatmap, {
		type HeatmapCell,
		type HeatmapPalette,
		type HeatmapSize
	} from './Heatmap.svelte';

	type Example =
		| 'activity'
		| 'correlation'
		| 'risk'
		| 'calendar'
		| 'values'
		| 'sparse'
		| 'diverging';

	let props = $props<{
		example?: Example;
		palette?: HeatmapPalette;
		size?: HeatmapSize;
		showValues?: boolean;
		showLegend?: boolean;
		interactive?: boolean;
		rotateColLabels?: boolean;
		unit?: string;
	}>();

	const example = $derived(props.example ?? 'activity');
	let last = $state('—');

	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const hours = ['6a', '9a', '12p', '3p', '6p', '9p'];

	const activityData: HeatmapCell[] = days.flatMap((_, row) =>
		hours.map((_, col) => ({
			row,
			col,
			value: Math.round(Math.abs(Math.sin(row * 1.3 + col * 0.7)) * 10 + ((row + col) % 4))
		}))
	);

	const metrics = ['Latency', 'Errors', 'CPU', 'Memory', 'Disk'];
	const correlationData: HeatmapCell[] = metrics.flatMap((_, row) =>
		metrics.map((_, col) => {
			if (row === col) return { row, col, value: 1 };
			const v = Math.cos(row * 0.9 + col * 1.1) * 0.7;
			return { row, col, value: Math.round(v * 100) / 100 };
		})
	);

	const severities = ['P1', 'P2', 'P3', 'P4'];
	const services = ['API', 'Auth', 'Billing', 'Search', 'Notify'];
	const riskData: HeatmapCell[] = severities.flatMap((_, row) =>
		services.map((_, col) => ({
			row,
			col,
			value: Math.round(2 + ((row * 3 + col * 5) % 9) + Math.sin(row + col) * 2)
		}))
	);

	const weeks = ['W1', 'W2', 'W3', 'W4', 'W5'];
	const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	const calendarData: HeatmapCell[] = weeks
		.flatMap((_, row) =>
			weekDays.map((_, col) => {
				const empty = (row === 0 && col < 2) || (row === 4 && col > 4);
				if (empty) return null;
				return {
					row,
					col,
					value: Math.round(Math.abs(Math.sin(row * 2.1 + col)) * 12)
				};
			})
		)
		.filter((c): c is HeatmapCell => c !== null);

	const sparseData: HeatmapCell[] = [
		{ row: 0, col: 1, value: 4 },
		{ row: 1, col: 3, value: 8 },
		{ row: 2, col: 0, value: 2 },
		{ row: 2, col: 4, value: 11 },
		{ row: 3, col: 2, value: 6 },
		{ row: 4, col: 4, value: 9 },
		{ row: 5, col: 1, value: 3 },
		{ row: 6, col: 5, value: 7 }
	];

	const deltaRows = ['North', 'South', 'East', 'West'];
	const deltaCols = ['Q1', 'Q2', 'Q3', 'Q4'];
	const divergingData: HeatmapCell[] = deltaRows.flatMap((_, row) =>
		deltaCols.map((_, col) => ({
			row,
			col,
			value: Math.round((Math.sin(row * 1.4 + col * 0.8) * 40 + (col - 1.5) * 8) * 10) / 10
		}))
	);

	function formatCell(c: HeatmapCell) {
		return `r${c.row} c${c.col} = ${c.value}`;
	}
</script>

<div class="w-full max-w-xl space-y-2">
	<p class="text-xs text-secondary">
		Last interaction: <span class="font-medium text-primary">{last}</span>
	</p>

	<div class="rounded-2xl border border-border bg-surface-elevated p-4">
		{#if example === 'correlation'}
			<p class="mb-3 text-sm font-semibold text-primary">Metric correlation</p>
			<Heatmap
				data={correlationData}
				rows={metrics}
				cols={metrics}
				palette={props.palette ?? 'blue'}
				size={props.size ?? 'md'}
				domainMin={-1}
				domainMax={1}
				decimals={2}
				showValues={props.showValues ?? true}
				showLegend={props.showLegend ?? true}
				interactive={props.interactive ?? true}
				legendLabel="Correlation"
				onselect={(c) => (last = `${metrics[c.row]} × ${metrics[c.col]} = ${c.value}`)}
			/>
		{:else if example === 'risk'}
			<p class="mb-3 text-sm font-semibold text-primary">Incident density</p>
			<Heatmap
				data={riskData}
				rows={severities}
				cols={services}
				palette={props.palette ?? 'red'}
				size={props.size ?? 'md'}
				showValues={props.showValues ?? true}
				showLegend={props.showLegend ?? true}
				unit={props.unit ?? ''}
				legendLabel="Count"
				onselect={(c) => (last = `${severities[c.row]} / ${services[c.col]} → ${c.value}`)}
			/>
		{:else if example === 'calendar'}
			<p class="mb-3 text-sm font-semibold text-primary">Contributions</p>
			<Heatmap
				data={calendarData}
				rows={weeks}
				cols={weekDays}
				palette={props.palette ?? 'green'}
				size={props.size ?? 'sm'}
				cellGap={2}
				cellRadius={3}
				showLegend={props.showLegend ?? true}
				showValues={false}
				legendLabel="Commits"
				onselect={(c) => (last = `${weeks[c.row]} ${weekDays[c.col]}: ${c.value}`)}
			/>
		{:else if example === 'values'}
			<p class="mb-3 text-sm font-semibold text-primary">Latency by region (ms)</p>
			<Heatmap
				data={activityData}
				rows={days}
				cols={hours}
				palette={props.palette ?? 'orange'}
				size={props.size ?? 'lg'}
				showValues={true}
				showLegend={props.showLegend ?? true}
				unit="ms"
				legendLabel="Latency"
				onselect={(c) => (last = formatCell(c))}
			/>
		{:else if example === 'sparse'}
			<p class="mb-3 text-sm font-semibold text-primary">Sparse events</p>
			<Heatmap
				data={sparseData}
				rows={days}
				cols={hours}
				palette={props.palette ?? 'purple'}
				size={props.size ?? 'md'}
				showLegend={props.showLegend ?? true}
				emptyColor="var(--color-surface-overlay, #f4f4f5)"
				onselect={(c) => (last = formatCell(c))}
			/>
		{:else if example === 'diverging'}
			<p class="mb-3 text-sm font-semibold text-primary">Growth vs plan (%)</p>
			<Heatmap
				data={divergingData}
				rows={deltaRows}
				cols={deltaCols}
				palette={props.palette ?? 'diverging'}
				size={props.size ?? 'md'}
				showValues={props.showValues ?? true}
				showLegend={props.showLegend ?? true}
				unit="%"
				decimals={1}
				domainMin={-40}
				domainMax={40}
				legendLabel="Delta"
				rotateColLabels={props.rotateColLabels ?? false}
				onselect={(c) => (last = `${deltaRows[c.row]} ${deltaCols[c.col]}: ${c.value}%`)}
			/>
		{:else}
			<p class="mb-3 text-sm font-semibold text-primary">Activity heatmap</p>
			<Heatmap
				data={activityData}
				rows={days}
				cols={hours}
				palette={props.palette ?? 'brand'}
				size={props.size ?? 'md'}
				showValues={props.showValues ?? false}
				showLegend={props.showLegend ?? true}
				interactive={props.interactive ?? true}
				unit={props.unit ?? ''}
				rotateColLabels={props.rotateColLabels ?? false}
				onselect={(c) => (last = formatCell(c))}
			/>
		{/if}
	</div>
</div>
