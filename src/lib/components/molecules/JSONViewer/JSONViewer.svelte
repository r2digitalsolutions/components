<script lang="ts">
	interface JSONViewerProps {
		data?: unknown;
		collapsed?: boolean;
		class?: string;
	}

	let { data = null, collapsed = false, class: className = '' }: JSONViewerProps = $props();

	let open = $state<Record<string, boolean>>({});

	function isOpen(path: string, depth: number) {
		if (path in open) return open[path];
		return !collapsed && depth < 2;
	}

	function toggle(path: string, depth: number) {
		open = { ...open, [path]: !isOpen(path, depth) };
	}

	function typeLabel(v: unknown) {
		if (v === null) return 'null';
		if (Array.isArray(v)) return `Array(${v.length})`;
		return typeof v;
	}
</script>

{#snippet node(value: unknown, path: string, depth: number)}
	{#if value !== null && typeof value === 'object'}
		{@const entries = Array.isArray(value)
			? value.map((v, i) => [String(i), v] as const)
			: Object.entries(value as Record<string, unknown>)}
		<div>
			<button
				type="button"
				class="inline-flex items-center gap-1 rounded px-1 font-mono text-xs text-secondary hover:bg-surface-overlay"
				onclick={() => toggle(path, depth)}
			>
				<span class="text-muted">{isOpen(path, depth) ? '▼' : '▶'}</span>
				<span>{typeLabel(value)}</span>
			</button>
			{#if isOpen(path, depth)}
				<div class="ml-3 border-l border-border pl-3">
					{#each entries as [key, child]}
						<div class="py-0.5 font-mono text-xs">
							<span class="text-brand-600 dark:text-brand-400">{key}</span>
							<span class="text-muted">: </span>
							{#if child !== null && typeof child === 'object'}
								{@render node(child, `${path}.${key}`, depth + 1)}
							{:else}
								<span class="text-primary">{JSON.stringify(child)}</span>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<span class="font-mono text-xs text-primary">{JSON.stringify(value)}</span>
	{/if}
{/snippet}

<div class={['overflow-auto rounded-xl border border-border bg-surface-elevated p-3', className]}>
	{@render node(data, 'root', 0)}
</div>
