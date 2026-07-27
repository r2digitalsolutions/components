<script lang="ts">
	export interface TraceSpan {
		id: string;
		name: string;
		startMs: number;
		durationMs: number;
		service?: string;
		status?: 'ok' | 'error' | 'unset';
		children?: TraceSpan[];
	}

	interface TraceWaterfallProps {
		spans?: TraceSpan[];
		selectedId?: string;
		class?: string;
		onselect?: (span: TraceSpan) => void;
	}

	let {
		spans = [],
		selectedId = $bindable(''),
		class: className = '',
		onselect
	}: TraceWaterfallProps = $props();

	function flatten(
		list: TraceSpan[],
		depth = 0
	): { span: TraceSpan; depth: number }[] {
		const out: { span: TraceSpan; depth: number }[] = [];
		for (const span of list) {
			out.push({ span, depth });
			if (span.children?.length) out.push(...flatten(span.children, depth + 1));
		}
		return out;
	}

	const flat = $derived(flatten(spans));

	const totalMs = $derived.by(() => {
		let max = 0;
		for (const { span } of flat) {
			max = Math.max(max, span.startMs + span.durationMs);
		}
		return Math.max(max, 1);
	});

	const ticks = $derived.by(() => {
		const steps = 4;
		return Array.from({ length: steps + 1 }, (_, i) => (totalMs * i) / steps);
	});

	const statusBar: Record<string, string> = {
		ok: 'bg-emerald-500 dark:bg-emerald-400',
		error: 'bg-red-500 dark:bg-red-400',
		unset: 'bg-sky-500 dark:bg-sky-400'
	};

	const statusDot: Record<string, string> = {
		ok: 'bg-emerald-500',
		error: 'bg-red-500',
		unset: 'bg-sky-500'
	};

	function pick(span: TraceSpan) {
		selectedId = span.id;
		onselect?.(span);
	}

	function formatMs(ms: number) {
		return ms >= 100 ? `${Math.round(ms)}ms` : `${ms.toFixed(ms >= 10 ? 0 : 1)}ms`;
	}
</script>

<div
	class={['overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-sm', className]}
	data-trace-waterfall
>
	<div class="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
		<span class="text-xs font-medium text-primary">
			Trace · {formatMs(totalMs)} total · {flat.length} spans
		</span>
		<div class="flex items-center gap-3 text-[10px] text-muted">
			<span class="inline-flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>ok</span>
			<span class="inline-flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>error</span>
			<span class="inline-flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-sky-500"></span>unset</span>
		</div>
	</div>

	<div class="sticky top-0 z-10 grid grid-cols-[minmax(140px,200px)_1fr_56px] gap-2 border-b border-border bg-surface-overlay/90 px-3 py-1.5 backdrop-blur">
		<span class="text-[10px] font-semibold uppercase tracking-wide text-muted">Span</span>
		<div class="relative h-4">
			{#each ticks as tick, i (i)}
				<span
					class="absolute top-0 -translate-x-1/2 text-[10px] tabular-nums text-muted first:translate-x-0 last:-translate-x-full"
					style={`left:${(tick / totalMs) * 100}%`}
				>
					{formatMs(tick)}
				</span>
			{/each}
		</div>
		<span class="text-right text-[10px] font-semibold uppercase tracking-wide text-muted">Dur</span>
	</div>

	<ul class="max-h-[420px] overflow-auto p-1.5">
		{#each flat as row (row.span.id)}
			<li>
				<button
					type="button"
					class={[
						'grid w-full grid-cols-[minmax(140px,200px)_1fr_56px] items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors',
						'hover:bg-surface-overlay',
						selectedId === row.span.id ? 'bg-brand-50 ring-1 ring-brand-200/80 dark:bg-brand-950/30 dark:ring-brand-800/60' : ''
					]}
					onclick={() => pick(row.span)}
				>
					<div class="flex min-w-0 items-start gap-1.5" style={`padding-left:${row.depth * 12}px`}>
						<span
							class={['mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', statusDot[row.span.status ?? 'unset']]}
							aria-hidden="true"
						></span>
						<div class="min-w-0">
							<p class="truncate text-xs font-medium text-primary">{row.span.name}</p>
							{#if row.span.service}
								<p class="truncate text-[10px] text-muted">{row.span.service}</p>
							{/if}
						</div>
					</div>

					<div class="relative h-5 overflow-hidden rounded-md bg-surface-overlay ring-1 ring-border/60">
						{#each ticks.slice(1, -1) as tick (tick)}
							<span
								class="absolute inset-y-0 w-px bg-border/70"
								style={`left:${(tick / totalMs) * 100}%`}
								aria-hidden="true"
							></span>
						{/each}
						<span
							class={[
								'absolute top-1 h-3 rounded-[3px] shadow-sm',
								statusBar[row.span.status ?? 'unset']
							]}
							style={`left:${(row.span.startMs / totalMs) * 100}%;width:${Math.max((row.span.durationMs / totalMs) * 100, 0.8)}%`}
							title={`${row.span.name} · ${formatMs(row.span.durationMs)}`}
						></span>
					</div>

					<span class="text-right font-mono text-[10px] tabular-nums text-muted">
						{formatMs(row.span.durationMs)}
					</span>
				</button>
			</li>
		{/each}
		{#if !flat.length}
			<li class="px-3 py-8 text-center text-sm text-muted">No spans</li>
		{/if}
	</ul>
</div>
