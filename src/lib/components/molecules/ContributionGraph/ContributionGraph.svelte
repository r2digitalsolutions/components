<script module lang="ts">
	export interface ContributionDay {
		/** ISO date `YYYY-MM-DD` */
		date: string;
		count: number;
		/** Optional tooltip override */
		label?: string;
	}

	export type ContributionPalette = 'green' | 'brand' | 'blue' | 'orange';
</script>

<script lang="ts">
	interface ContributionGraphProps {
		data?: ContributionDay[];
		/** Weeks to show (default ~1 year) */
		weeks?: number;
		palette?: ContributionPalette;
		cellSize?: number;
		cellGap?: number;
		showMonthLabels?: boolean;
		showLegend?: boolean;
		showWeekdayLabels?: boolean;
		ariaLabel?: string;
		class?: string;
		onselect?: (day: ContributionDay) => void;
	}

	const LEVELS: Record<ContributionPalette, string[]> = {
		green: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
		brand: [
			'var(--color-surface-muted, #ebedf0)',
			'var(--color-brand-200, #c7d2fe)',
			'var(--color-brand-400, #818cf8)',
			'var(--color-brand-500, #6366f1)',
			'var(--color-brand-700, #4338ca)'
		],
		blue: ['#ebedf0', '#9ecbff', '#54a3ff', '#2188ff', '#005cc5'],
		orange: ['#ebedf0', '#ffd8a8', '#ffa94d', '#fd7e14', '#e8590c']
	};

	const WEEKDAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
	const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	let {
		data = [],
		weeks = 53,
		palette = 'green',
		cellSize = 11,
		cellGap = 3,
		showMonthLabels = true,
		showLegend = true,
		showWeekdayLabels = true,
		ariaLabel = 'Contribution activity',
		class: className = '',
		onselect
	}: ContributionGraphProps = $props();

	let tip = $state<{ label: string; x: number; y: number } | null>(null);

	const byDate = $derived(new Map(data.map((d) => [d.date, d])));

	const colors = $derived(LEVELS[palette]);

	const grid = $derived.by(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const end = new Date(today);
		// Align to Saturday end of week (like GitHub: Sun–Sat columns)
		const day = end.getDay(); // 0=Sun
		const start = new Date(end);
		start.setDate(end.getDate() - day - (weeks - 1) * 7);

		const columns: { date: string; count: number; label?: string; level: number }[][] = [];
		const cursor = new Date(start);
		const maxCount = Math.max(1, ...data.map((d) => d.count));

		for (let w = 0; w < weeks; w++) {
			const col: (typeof columns)[number] = [];
			for (let d = 0; d < 7; d++) {
				const iso = toIso(cursor);
				const entry = byDate.get(iso);
				const count = entry?.count ?? 0;
				const level =
					count <= 0 ? 0 : Math.min(4, Math.ceil((count / maxCount) * 4) || 1);
				col.push({
					date: iso,
					count,
					label: entry?.label,
					level
				});
				cursor.setDate(cursor.getDate() + 1);
			}
			columns.push(col);
		}
		return columns;
	});

	const monthLabels = $derived.by(() => {
		const labels: { week: number; label: string }[] = [];
		let lastMonth = -1;
		for (let w = 0; w < grid.length; w++) {
			const first = grid[w]?.[0];
			if (!first) continue;
			const month = new Date(first.date + 'T12:00:00').getMonth();
			if (month !== lastMonth) {
				labels.push({ week: w, label: MONTHS[month] });
				lastMonth = month;
			}
		}
		return labels;
	});

	function toIso(d: Date) {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}

	function levelLabel(count: number) {
		if (count === 0) return 'No contributions';
		return `${count} contribution${count === 1 ? '' : 's'}`;
	}

	function showTip(e: MouseEvent, day: { date: string; count: number; label?: string }) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const parent = (e.currentTarget as HTMLElement).closest('[data-cg]') as HTMLElement;
		const parentRect = parent.getBoundingClientRect();
		tip = {
			label: day.label ?? `${levelLabel(day.count)} on ${day.date}`,
			x: rect.left - parentRect.left + rect.width / 2,
			y: rect.top - parentRect.top - 8
		};
	}

	const step = $derived(cellSize + cellGap);
	const labelW = $derived(showWeekdayLabels ? 28 : 0);
	const monthH = $derived(showMonthLabels ? 18 : 0);
</script>

<div
	class={['relative inline-flex flex-col gap-2', className]}
	data-cg
	role="img"
	aria-label={ariaLabel}
>
	{#if tip}
		<div
			class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px] text-white shadow-md"
			style:left={`${tip.x}px`}
			style:top={`${tip.y}px`}
		>
			{tip.label}
		</div>
	{/if}

	<svg
		width={labelW + weeks * step}
		height={monthH + 7 * step}
		class="overflow-visible"
		role="presentation"
		onmouseleave={() => (tip = null)}
	>
		{#if showMonthLabels}
			{#each monthLabels as m (m.week)}
				<text
					x={labelW + m.week * step}
					y={12}
					class="fill-muted text-[10px]"
					style="font-size: 10px; fill: var(--text-muted, #71717a)"
				>
					{m.label}
				</text>
			{/each}
		{/if}

		{#if showWeekdayLabels}
			{#each WEEKDAYS as label, i (i)}
				{#if label}
					<text
						x={0}
						y={monthH + i * step + cellSize - 1}
						style="font-size: 9px; fill: var(--text-muted, #71717a)"
					>
						{label}
					</text>
				{/if}
			{/each}
		{/if}

		{#each grid as col, wi (wi)}
			{#each col as day, di (day.date)}
				<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
				<rect
					x={labelW + wi * step}
					y={monthH + di * step}
					width={cellSize}
					height={cellSize}
					rx={2}
					ry={2}
					fill={colors[day.level]}
					class={onselect ? 'cursor-pointer' : undefined}
					onmouseenter={(e) => showTip(e, day)}
					onclick={() => onselect?.(day)}
				>
					<title>{day.label ?? `${levelLabel(day.count)} on ${day.date}`}</title>
				</rect>
			{/each}
		{/each}
	</svg>

	{#if showLegend}
		<div class="flex items-center justify-end gap-1 text-[10px] text-muted">
			<span>Less</span>
			{#each colors as c, i (i)}
				<span class="inline-block rounded-sm" style:width={`${cellSize}px`} style:height={`${cellSize}px`} style:background={c}></span>
			{/each}
			<span>More</span>
		</div>
	{/if}
</div>
