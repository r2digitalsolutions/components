<script lang="ts">
	import Gauge, {
		type GaugeSize,
		type GaugeTone,
		type GaugeVariant,
		type GaugeZone
	} from './Gauge.svelte';

	type Example = 'cpu' | 'health' | 'storage' | 'score' | 'ring' | 'horseshoe' | 'battery' | 'grid';

	let props = $props<{
		example?: Example;
		value?: number;
		min?: number;
		max?: number;
		size?: GaugeSize;
		variant?: GaugeVariant;
		tone?: GaugeTone;
		unit?: string;
		label?: string;
		description?: string;
		showNeedle?: boolean;
		showTicks?: boolean;
		showMinMax?: boolean;
		showZones?: boolean;
		animated?: boolean;
	}>();

	const example = $derived(props.example ?? 'cpu');

	const cpuZones: GaugeZone[] = [
		{ at: 0, color: '#22c55e', label: 'Healthy' },
		{ at: 0.6, color: '#f59e0b', label: 'Elevated' },
		{ at: 0.85, color: '#ef4444', label: 'Critical' }
	];

	const healthZones: GaugeZone[] = [
		{ at: 0, color: '#ef4444', label: 'Poor' },
		{ at: 0.4, color: '#f59e0b', label: 'Fair' },
		{ at: 0.7, color: '#22c55e', label: 'Good' }
	];

	const storageZones: GaugeZone[] = [
		{ at: 0, color: '#0ea5e9', label: 'Plenty' },
		{ at: 0.75, color: '#f59e0b', label: 'Filling up' },
		{ at: 0.9, color: '#ef4444', label: 'Almost full' }
	];
</script>

<div class="w-full max-w-2xl space-y-3">
	{#if example === 'grid'}
		<div class="grid gap-4 sm:grid-cols-3">
			<div class="flex justify-center overflow-hidden rounded-2xl border border-border bg-surface-elevated p-5">
				<Gauge
					value={props.value ?? 72}
					label="CPU"
					unit="%"
					size="sm"
					zones={cpuZones}
					showNeedle={props.showNeedle ?? true}
				/>
			</div>
			<div class="flex justify-center overflow-hidden rounded-2xl border border-border bg-surface-elevated p-5">
				<Gauge
					value={64}
					label="Memory"
					unit="%"
					size="sm"
					tone="info"
					zones={storageZones}
					showNeedle={props.showNeedle ?? true}
				/>
			</div>
			<div class="flex justify-center overflow-hidden rounded-2xl border border-border bg-surface-elevated p-5">
				<Gauge
					value={91}
					label="Disk"
					unit="%"
					size="sm"
					zones={storageZones}
					showNeedle={props.showNeedle ?? true}
				/>
			</div>
		</div>
	{:else if example === 'ring'}
		<div class="inline-flex overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6">
			<Gauge
				value={props.value ?? 86}
				variant="ring"
				size={props.size ?? 'md'}
				tone={props.tone ?? 'success'}
				label={props.label ?? 'Uptime'}
				unit={props.unit ?? '%'}
				description={props.description ?? 'Last 30 days'}
				showNeedle={false}
				showTicks={props.showTicks ?? false}
				animated={props.animated ?? true}
			/>
		</div>
	{:else if example === 'horseshoe'}
		<div class="inline-flex overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6">
			<Gauge
				value={props.value ?? 68}
				variant="horseshoe"
				size={props.size ?? 'lg'}
				tone={props.tone ?? 'brand'}
				label={props.label ?? 'NPS'}
				description={props.description ?? 'Promoters − detractors'}
				min={props.min ?? 0}
				max={props.max ?? 100}
				showNeedle={props.showNeedle ?? true}
				showTicks={props.showTicks ?? true}
				showMinMax={props.showMinMax ?? true}
				zones={healthZones}
				showZones={props.showZones ?? true}
			/>
		</div>
	{:else if example === 'health'}
		<div class="inline-flex overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6">
			<Gauge
				value={props.value ?? 82}
				size={props.size ?? 'md'}
				label={props.label ?? 'Health score'}
				unit=""
				description={props.description}
				zones={healthZones}
				showZones={props.showZones ?? true}
				showNeedle={props.showNeedle ?? true}
				showTicks={props.showTicks ?? false}
				showMinMax={props.showMinMax ?? true}
				tone={props.tone ?? 'success'}
			/>
		</div>
	{:else if example === 'storage'}
		<div class="inline-flex overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6">
			<Gauge
				value={props.value ?? 74.5}
				min={0}
				max={100}
				size={props.size ?? 'md'}
				label={props.label ?? 'Storage used'}
				unit={props.unit ?? '%'}
				decimals={1}
				zones={storageZones}
				showNeedle={props.showNeedle ?? true}
				tone="info"
			/>
		</div>
	{:else if example === 'score'}
		<div class="inline-flex overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6">
			<Gauge
				value={props.value ?? 4.6}
				min={0}
				max={5}
				size={props.size ?? 'md'}
				label={props.label ?? 'Rating'}
				decimals={1}
				tone={props.tone ?? 'warning'}
				showNeedle={props.showNeedle ?? true}
				showMinMax={true}
				description="Based on 1,284 reviews"
			/>
		</div>
	{:else if example === 'battery'}
		<div class="inline-flex overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6">
			<Gauge
				value={props.value ?? 38}
				variant="arc"
				size={props.size ?? 'sm'}
				label={props.label ?? 'Battery'}
				unit="%"
				tone={props.tone ?? 'danger'}
				showNeedle={false}
				zones={[
					{ at: 0, color: '#ef4444', label: 'Low' },
					{ at: 0.2, color: '#f59e0b', label: 'Medium' },
					{ at: 0.5, color: '#22c55e', label: 'Good' }
				]}
			/>
		</div>
	{:else}
		<div class="inline-flex overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6">
			<Gauge
				value={props.value ?? 72}
				min={props.min ?? 0}
				max={props.max ?? 100}
				size={props.size ?? 'md'}
				variant={props.variant ?? 'arc'}
				tone={props.tone ?? 'brand'}
				label={props.label ?? 'CPU usage'}
				description={props.description}
				unit={props.unit ?? '%'}
				showNeedle={props.showNeedle ?? true}
				showTicks={props.showTicks ?? false}
				showMinMax={props.showMinMax ?? false}
				showZones={props.showZones ?? true}
				animated={props.animated ?? true}
				zones={cpuZones}
			/>
		</div>
	{/if}
</div>
