<script lang="ts">
	import {
		diffLines,
		diffStats,
		diffWords,
		toSplitRows,
		type DiffOp,
		type DiffPart
	} from '$lib/utils/diff.js';

	export type DiffMode = 'unified' | 'split';

	interface DiffViewerProps {
		before?: string;
		after?: string;
		mode?: DiffMode;
		beforeLabel?: string;
		afterLabel?: string;
		title?: string;
		showToolbar?: boolean;
		allowModeToggle?: boolean;
		wordDiff?: boolean;
		maxHeight?: string;
		class?: string;
		onmodechange?: (mode: DiffMode) => void;
	}

	let {
		before = '',
		after = '',
		mode = $bindable<'unified' | 'split'>('unified'),
		beforeLabel = 'Before',
		afterLabel = 'After',
		title = 'Diff',
		showToolbar = true,
		allowModeToggle = true,
		wordDiff = true,
		maxHeight = '28rem',
		class: className = '',
		onmodechange
	}: DiffViewerProps = $props();

	const ops = $derived(diffLines(before, after));
	const stats = $derived(diffStats(ops));
	const splitRows = $derived(toSplitRows(ops, wordDiff));

	/** Index → word parts for unified delete/insert pairs */
	const unifiedParts = $derived.by(() => {
		const map = new Map<number, { left: DiffPart[]; right: DiffPart[] }>();
		if (!wordDiff) return map;
		for (let i = 0; i < ops.length - 1; i++) {
			if (ops[i].type === 'delete' && ops[i + 1].type === 'insert') {
				map.set(i, diffWords(ops[i].value, ops[i + 1].value));
			}
		}
		return map;
	});

	function setMode(next: DiffMode) {
		mode = next;
		onmodechange?.(next);
	}

	function lineClass(type: string) {
		if (type === 'insert') {
			return 'bg-emerald-50/90 text-emerald-950 dark:bg-emerald-950/35 dark:text-emerald-100';
		}
		if (type === 'delete') {
			return 'bg-rose-50/90 text-rose-950 dark:bg-rose-950/35 dark:text-rose-100';
		}
		if (type === 'empty') {
			return 'bg-surface-overlay/40 text-transparent';
		}
		return 'bg-transparent text-secondary';
	}

	function gutterClass(type: string) {
		if (type === 'insert') return 'text-emerald-600/70 dark:text-emerald-400/70';
		if (type === 'delete') return 'text-rose-600/70 dark:text-rose-400/70';
		return 'text-muted/60';
	}

	function marker(type: DiffOp['type'] | 'empty' | 'equal') {
		if (type === 'insert') return '+';
		if (type === 'delete') return '−';
		return ' ';
	}
</script>

{#snippet parts(list: DiffPart[] | undefined, text: string, changedTone: 'add' | 'del')}
	{#if list && list.some((p) => p.changed)}
		<span class="whitespace-pre-wrap break-all">
			{#each list as part}
				{#if part.changed}
					<span
						class={[
							'rounded-[2px] px-px',
							changedTone === 'add'
								? 'bg-emerald-200/80 dark:bg-emerald-500/35'
								: 'bg-rose-200/80 dark:bg-rose-500/35'
						]}>{part.text}</span
					>
				{:else}
					{part.text}
				{/if}
			{/each}
		</span>
	{:else}
		<span class="whitespace-pre-wrap break-all">{text.length ? text : ' '}</span>
	{/if}
{/snippet}

<div
	class={[
		'flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
>
	{#if showToolbar}
		<header
			class="flex flex-wrap items-center gap-2 border-b border-border bg-surface/40 px-3 py-2.5"
		>
			<div class="min-w-0 flex-1">
				<p class="truncate text-xs font-semibold text-primary">{title}</p>
				<p class="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] tabular-nums">
					<span class="font-medium text-emerald-600 dark:text-emerald-400"
						>+{stats.additions}</span
					>
					<span class="font-medium text-rose-600 dark:text-rose-400">−{stats.deletions}</span>
					<span class="text-muted">{stats.unchanged} unchanged</span>
				</p>
			</div>

			{#if allowModeToggle}
				<div
					class="inline-flex rounded-lg border border-border bg-surface p-0.5 text-[11px] font-medium"
					role="group"
					aria-label="Diff view mode"
				>
					<button
						type="button"
						class={[
							'rounded-md px-2.5 py-1 transition',
							mode === 'unified'
								? 'bg-surface-elevated text-primary shadow-sm'
								: 'text-muted hover:text-primary'
						]}
						onclick={() => setMode('unified')}
					>
						Unified
					</button>
					<button
						type="button"
						class={[
							'rounded-md px-2.5 py-1 transition',
							mode === 'split'
								? 'bg-surface-elevated text-primary shadow-sm'
								: 'text-muted hover:text-primary'
						]}
						onclick={() => setMode('split')}
					>
						Split
					</button>
				</div>
			{/if}
		</header>
	{/if}

	<div class="overflow-auto font-mono text-[12px] leading-5" style:max-height={maxHeight}>
		{#if mode === 'split'}
			<div class="grid min-w-[40rem] grid-cols-2 divide-x divide-border">
				<div class="min-w-0">
					<div
						class="sticky top-0 z-10 border-b border-border bg-surface-elevated/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted backdrop-blur"
					>
						{beforeLabel}
					</div>
					{#each splitRows as row, i (i)}
						{@const cell = row.left}
						{@const type = cell?.type ?? 'empty'}
						<div class={['flex min-h-5', lineClass(type)]}>
							<span
								class={[
									'w-9 shrink-0 select-none border-r border-border/50 px-1.5 text-right tabular-nums',
									gutterClass(type)
								]}
							>
								{cell?.line ?? ''}
							</span>
							<span
								class={[
									'w-5 shrink-0 select-none text-center font-semibold',
									gutterClass(type)
								]}
							>
								{type === 'delete' ? '−' : ' '}
							</span>
							<div class="min-w-0 flex-1 px-2 py-0.5">
								{#if type === 'delete'}
									{@render parts(row.leftParts, cell?.text ?? '', 'del')}
								{:else}
									<span class="whitespace-pre-wrap break-all">{cell?.text || ' '}</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<div class="min-w-0">
					<div
						class="sticky top-0 z-10 border-b border-border bg-surface-elevated/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted backdrop-blur"
					>
						{afterLabel}
					</div>
					{#each splitRows as row, i (i)}
						{@const cell = row.right}
						{@const type = cell?.type ?? 'empty'}
						<div class={['flex min-h-5', lineClass(type)]}>
							<span
								class={[
									'w-9 shrink-0 select-none border-r border-border/50 px-1.5 text-right tabular-nums',
									gutterClass(type)
								]}
							>
								{cell?.line ?? ''}
							</span>
							<span
								class={[
									'w-5 shrink-0 select-none text-center font-semibold',
									gutterClass(type)
								]}
							>
								{type === 'insert' ? '+' : ' '}
							</span>
							<div class="min-w-0 flex-1 px-2 py-0.5">
								{#if type === 'insert'}
									{@render parts(row.rightParts, cell?.text ?? '', 'add')}
								{:else}
									<span class="whitespace-pre-wrap break-all">{cell?.text || ' '}</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			{#if showToolbar}
				<div
					class="sticky top-0 z-10 flex gap-3 border-b border-border bg-surface-elevated/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted backdrop-blur"
				>
					<span class="w-9 text-right">Old</span>
					<span class="w-9 text-right">New</span>
					<span>{beforeLabel} → {afterLabel}</span>
				</div>
			{/if}
			{#each ops as op, i (i)}
				<div class={['flex min-h-5', lineClass(op.type)]}>
					<span
						class={[
							'w-9 shrink-0 select-none border-r border-border/40 px-1.5 text-right tabular-nums',
							gutterClass(op.type)
						]}
					>
						{op.oldLine ?? ''}
					</span>
					<span
						class={[
							'w-9 shrink-0 select-none border-r border-border/40 px-1.5 text-right tabular-nums',
							gutterClass(op.type)
						]}
					>
						{op.newLine ?? ''}
					</span>
					<span
						class={[
							'w-5 shrink-0 select-none text-center font-semibold',
							gutterClass(op.type)
						]}
					>
						{marker(op.type)}
					</span>
					<div class="min-w-0 flex-1 px-2 py-0.5">
						{#if op.type === 'delete' && unifiedParts.has(i)}
							{@render parts(unifiedParts.get(i)!.left, op.value, 'del')}
						{:else if op.type === 'insert' && unifiedParts.has(i - 1)}
							{@render parts(unifiedParts.get(i - 1)!.right, op.value, 'add')}
						{:else}
							<span class="whitespace-pre-wrap break-all">{op.value.length ? op.value : ' '}</span>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
