<script lang="ts">
	export interface GanttTask {
		id: string;
		label: string;
		/** ISO date `YYYY-MM-DD` */
		start: string;
		/** ISO date `YYYY-MM-DD` */
		end: string;
		progress?: number;
		color?: string;
		group?: string;
	}

	interface GanttChartProps {
		tasks?: GanttTask[];
		/** Inclusive range override; defaults from tasks */
		rangeStart?: string;
		rangeEnd?: string;
		rowHeight?: number;
		class?: string;
		onselect?: (task: GanttTask) => void;
	}

	const palette = [
		'var(--color-brand-500, #6366f1)',
		'#22c55e',
		'#f59e0b',
		'#0ea5e9',
		'#a855f7',
		'#ef4444'
	];

	let {
		tasks = [],
		rangeStart,
		rangeEnd,
		rowHeight = 36,
		class: className = '',
		onselect
	}: GanttChartProps = $props();

	let active = $state<string | null>(null);

	function parse(iso: string) {
		return new Date(iso + 'T12:00:00').getTime();
	}

	const domain = $derived.by(() => {
		const starts = tasks.map((t) => parse(t.start));
		const ends = tasks.map((t) => parse(t.end));
		const min = rangeStart ? parse(rangeStart) : Math.min(...starts, Date.now());
		const max = rangeEnd ? parse(rangeEnd) : Math.max(...ends, Date.now());
		const pad = (max - min) * 0.02 || 86400000;
		return { min: min - pad, max: max + pad };
	});

	const span = $derived(domain.max - domain.min || 1);

	const ticks = $derived.by(() => {
		const out: { label: string; pct: number }[] = [];
		const start = new Date(domain.min);
		start.setDate(1);
		start.setHours(12, 0, 0, 0);
		const cursor = new Date(start);
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		while (cursor.getTime() <= domain.max) {
			const t = cursor.getTime();
			if (t >= domain.min) {
				out.push({
					label: `${months[cursor.getMonth()]} ${String(cursor.getFullYear()).slice(2)}`,
					pct: ((t - domain.min) / span) * 100
				});
			}
			cursor.setMonth(cursor.getMonth() + 1);
		}
		return out;
	});

	const rows = $derived(
		tasks.map((t, i) => {
			const s = parse(t.start);
			const e = parse(t.end);
			const left = ((s - domain.min) / span) * 100;
			const width = Math.max(1.5, ((e - s) / span) * 100);
			return {
				...t,
				left,
				width,
				color: t.color ?? palette[i % palette.length],
				progress: Math.max(0, Math.min(100, t.progress ?? 0))
			};
		})
	);

	const labelW = 160;
</script>

<div
	class={['overflow-hidden rounded-xl border border-border bg-surface-elevated', className]}
	role="table"
	aria-label="Gantt chart"
>
	<!-- Header -->
	<div class="flex border-b border-border bg-surface-overlay/60" role="row">
		<div
			class="shrink-0 border-r border-border px-3 py-2 text-xs font-medium text-muted"
			style:width={`${labelW}px`}
		>
			Task
		</div>
		<div class="relative min-h-8 flex-1">
			{#each ticks as tick (tick.label + tick.pct)}
				<span
					class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-muted"
					style:left={`${tick.pct}%`}
				>
					{tick.label}
				</span>
			{/each}
		</div>
	</div>

	{#each rows as row (row.id)}
		<div
			class={[
				'flex border-b border-border last:border-b-0',
				active === row.id && 'bg-brand-500/5'
			]}
			style:height={`${rowHeight}px`}
			role="row"
		>
			<div
				class="flex shrink-0 items-center truncate border-r border-border px-3 text-sm text-primary"
				style:width={`${labelW}px`}
				title={row.label}
			>
				{row.label}
			</div>
			<div class="relative flex-1">
				{#each ticks as tick (tick.label + 'g' + tick.pct)}
					<div
						class="absolute inset-y-0 w-px bg-border/70"
						style:left={`${tick.pct}%`}
						aria-hidden="true"
					></div>
				{/each}
				<button
					type="button"
					class="absolute top-1/2 flex -translate-y-1/2 items-center overflow-hidden rounded-md text-left shadow-sm transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
					style:left={`${row.left}%`}
					style:width={`${row.width}%`}
					style:height={`${rowHeight - 12}px`}
					style:background={row.color}
					onclick={() => {
						active = row.id;
						onselect?.(row);
					}}
				>
					{#if row.progress > 0}
						<span
							class="absolute inset-y-0 left-0 bg-black/20"
							style:width={`${row.progress}%`}
							aria-hidden="true"
						></span>
					{/if}
					<span class="relative z-10 truncate px-2 text-[11px] font-medium text-white drop-shadow-sm">
						{row.label}
					</span>
				</button>
			</div>
		</div>
	{/each}

	{#if tasks.length === 0}
		<p class="px-4 py-8 text-center text-sm text-muted">No tasks</p>
	{/if}
</div>
