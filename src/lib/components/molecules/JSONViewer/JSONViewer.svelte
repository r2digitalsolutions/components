<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';

	interface JSONViewerProps {
		data?: unknown;
		/** Collapse all nodes by default */
		collapsed?: boolean;
		/** Expand nodes up to this depth (0 = only root). Ignored when collapsed. */
		defaultExpandDepth?: number;
		/** Show toolbar (copy / expand / collapse) */
		showToolbar?: boolean;
		/** Root label in the header */
		label?: string;
		/** Max height; scrolls inside */
		maxHeight?: string;
		class?: string;
		oncopy?: (json: string) => void;
	}

	let {
		data = null,
		collapsed = false,
		defaultExpandDepth = 1,
		showToolbar = true,
		label = 'JSON',
		maxHeight = '28rem',
		class: className = '',
		oncopy
	}: JSONViewerProps = $props();

	let openMap = $state<Record<string, boolean>>({});
	let query = $state('');
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | null = null;

	const parsed = $derived.by(() => {
		if (typeof data === 'string') {
			try {
				return JSON.parse(data) as unknown;
			} catch {
				return data;
			}
		}
		return data;
	});

	const pretty = $derived.by(() => {
		try {
			return JSON.stringify(parsed, null, 2);
		} catch {
			return String(parsed);
		}
	});

	const stats = $derived.by(() => summarize(parsed));

	function summarize(v: unknown): { keys: number; type: string } {
		if (v === null) return { keys: 0, type: 'null' };
		if (Array.isArray(v)) return { keys: v.length, type: 'array' };
		if (typeof v === 'object') return { keys: Object.keys(v as object).length, type: 'object' };
		return { keys: 0, type: typeof v };
	}

	function isOpen(path: string, depth: number) {
		if (path in openMap) return openMap[path];
		if (collapsed) return false;
		return depth < defaultExpandDepth;
	}

	function toggle(path: string, depth: number) {
		openMap = { ...openMap, [path]: !isOpen(path, depth) };
	}

	function setAll(expanded: boolean) {
		const next: Record<string, boolean> = {};
		walk(parsed, 'root', (path) => {
			next[path] = expanded;
		});
		openMap = next;
	}

	function walk(value: unknown, path: string, visit: (path: string) => void) {
		if (value === null || typeof value !== 'object') return;
		visit(path);
		const entries = Array.isArray(value)
			? value.map((v, i) => [String(i), v] as const)
			: Object.entries(value as Record<string, unknown>);
		for (const [k, child] of entries) {
			walk(child, `${path}.${k}`, visit);
		}
	}

	async function copyJson() {
		try {
			await navigator.clipboard.writeText(pretty);
			copied = true;
			oncopy?.(pretty);
			if (copyTimer) clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 1600);
		} catch {
			/* ignore */
		}
	}

	function matchesQuery(key: string, value: unknown): boolean {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		if (key.toLowerCase().includes(q)) return true;
		if (value === null) return 'null'.includes(q);
		if (typeof value !== 'object') return String(value).toLowerCase().includes(q);
		return JSON.stringify(value).toLowerCase().includes(q);
	}

	function valueKind(v: unknown): 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array' {
		if (v === null) return 'null';
		if (Array.isArray(v)) return 'array';
		if (typeof v === 'object') return 'object';
		if (typeof v === 'boolean') return 'boolean';
		if (typeof v === 'number') return 'number';
		return 'string';
	}

	function preview(v: unknown): string {
		if (v === null) return 'null';
		if (Array.isArray(v)) return v.length ? `Array(${v.length})` : '[]';
		if (typeof v === 'object') {
			const n = Object.keys(v as object).length;
			return n ? `{ ${n} }` : '{}';
		}
		return '';
	}

	function entriesOf(value: object | unknown[]): [string, unknown][] {
		if (Array.isArray(value)) return value.map((v, i) => [String(i), v]);
		return Object.entries(value as Record<string, unknown>);
	}
</script>

{#snippet primitive(value: unknown)}
	{@const kind = valueKind(value)}
	{#if kind === 'string'}
		<span class="text-emerald-600 dark:text-emerald-400">"{value as string}"</span>
	{:else if kind === 'number'}
		<span class="text-sky-600 dark:text-sky-400">{value as number}</span>
	{:else if kind === 'boolean'}
		<span class="text-amber-600 dark:text-amber-400">{String(value)}</span>
	{:else if kind === 'null'}
		<span class="text-violet-500 dark:text-violet-400">null</span>
	{:else}
		<span class="text-primary">{JSON.stringify(value)}</span>
	{/if}
{/snippet}

{#snippet node(value: unknown, path: string, depth: number, keyLabel?: string)}
	{@const kind = valueKind(value)}
	{#if kind === 'object' || kind === 'array'}
		{@const entries = entriesOf(value as object | unknown[])}
		{@const expanded = isOpen(path, depth)}
		{@const filtered = query.trim()
			? entries.filter(([k, v]) => matchesQuery(k, v))
			: entries}
		<div class="group/node">
			<button
				type="button"
				class="inline-flex max-w-full items-center gap-1.5 rounded-md px-1 py-0.5 text-left font-mono text-[12px] leading-5 transition hover:bg-surface-overlay"
				onclick={() => toggle(path, depth)}
				aria-expanded={expanded}
			>
				<span
					class={[
						'flex h-4 w-4 shrink-0 items-center justify-center rounded text-muted transition',
						expanded && 'rotate-90'
					]}
					aria-hidden="true"
				>
					<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</span>
				{#if keyLabel !== undefined}
					<span class="shrink-0 text-brand-600 dark:text-brand-400">{keyLabel}</span>
					<span class="text-muted">:</span>
				{/if}
				<span class="text-muted">{kind === 'array' ? '[' : '{'}</span>
				{#if !expanded}
					<span class="truncate text-muted/80">{preview(value)}</span>
					<span class="text-muted">{kind === 'array' ? ']' : '}'}</span>
				{:else if filtered.length === 0}
					<span class="text-muted">{kind === 'array' ? ']' : '}'}</span>
				{/if}
			</button>

			{#if expanded && filtered.length > 0}
				<div class="ml-2 border-l border-border/80 pl-3">
					{#each filtered as [key, child] (key)}
						<div class="py-px">
							{#if child !== null && typeof child === 'object'}
								{@render node(child, `${path}.${key}`, depth + 1, key)}
							{:else}
								<div class="flex flex-wrap items-baseline gap-x-1.5 px-1 py-0.5 font-mono text-[12px] leading-5">
									<span class="text-brand-600 dark:text-brand-400">{key}</span>
									<span class="text-muted">:</span>
									{@render primitive(child)}
									<span class="text-muted">,</span>
								</div>
							{/if}
						</div>
					{/each}
				</div>
				<div class="px-1 font-mono text-[12px] leading-5 text-muted">
					{kind === 'array' ? ']' : '}'}
					{#if depth > 0}<span>,</span>{/if}
				</div>
			{/if}
		</div>
	{:else}
		<div class="flex flex-wrap items-baseline gap-x-1.5 px-1 py-0.5 font-mono text-[12px] leading-5">
			{#if keyLabel !== undefined}
				<span class="text-brand-600 dark:text-brand-400">{keyLabel}</span>
				<span class="text-muted">:</span>
			{/if}
			{@render primitive(value)}
		</div>
	{/if}
{/snippet}

{#snippet toolbar()}
	<div class="flex flex-wrap items-center gap-2 px-3 py-2">
		<div class="min-w-0 flex-1">
			<p class="truncate text-xs font-semibold text-primary">{label}</p>
			<p class="text-[10px] tabular-nums text-muted">
				{stats.type}{#if stats.keys > 0}
					· {stats.keys}
					{stats.type === 'array' ? 'items' : 'keys'}
				{/if}
				· {pretty.length} chars
			</p>
		</div>

		<div class="flex items-center gap-1">
			<button
				type="button"
				class="rounded-lg px-2 py-1 text-[11px] font-medium text-secondary transition hover:bg-surface-overlay hover:text-primary"
				onclick={() => setAll(true)}
			>
				Expand
			</button>
			<button
				type="button"
				class="rounded-lg px-2 py-1 text-[11px] font-medium text-secondary transition hover:bg-surface-overlay hover:text-primary"
				onclick={() => setAll(false)}
			>
				Collapse
			</button>
			<button
				type="button"
				class={[
					'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition',
					copied
						? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
						: 'text-secondary hover:bg-surface-overlay hover:text-primary'
				]}
				onclick={copyJson}
			>
				{#if copied}
					Copied
				{:else}
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2" />
						<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
					</svg>
					Copy
				{/if}
			</button>
		</div>
	</div>
{/snippet}

<Card class={className} padding="none" chrome header={showToolbar ? toolbar : undefined}>
	{#if showToolbar}
		<div class="border-b border-border px-3 py-2">
			<label class="relative block">
				<span class="sr-only">Filter keys</span>
				<svg
					class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="7" />
					<path stroke-linecap="round" d="M21 21l-4.3-4.3" />
				</svg>
				<input
					type="search"
					bind:value={query}
					placeholder="Filter keys or values…"
					class="h-8 w-full rounded-lg border border-border bg-surface pl-8 pr-3 text-xs text-primary outline-none placeholder:text-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
				/>
			</label>
		</div>
	{/if}

	<div class="overflow-auto p-3" style:max-height={maxHeight}>
		{@render node(parsed, 'root', 0)}
	</div>
</Card>
