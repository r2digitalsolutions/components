<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import VersionTag from '$lib/components/atoms/VersionTag/VersionTag.svelte';
	import DiffViewer from '$lib/components/molecules/DiffViewer/DiffViewer.svelte';
	import TimeAgo from '$lib/components/molecules/TimeAgo/TimeAgo.svelte';

	export interface VersionRevision {
		id: string;
		label: string;
		author?: string;
		createdAt?: string | Date | number;
		summary?: string;
		content?: string;
		previousContent?: string;
	}

	interface VersionHistoryPanelProps {
		revisions?: VersionRevision[];
		selectedId?: string;
		currentContent?: string;
		class?: string;
		onselect?: (revision: VersionRevision) => void;
		onrestore?: (revision: VersionRevision) => void;
	}

	let {
		revisions = [],
		selectedId = $bindable(''),
		currentContent = '',
		class: className = '',
		onselect,
		onrestore
	}: VersionHistoryPanelProps = $props();

	const selected = $derived(
		revisions.find((r) => r.id === selectedId) ?? revisions[0] ?? null
	);

	$effect(() => {
		if (!selectedId && revisions[0]) selectedId = revisions[0].id;
	});

	function pick(rev: VersionRevision) {
		selectedId = rev.id;
		onselect?.(rev);
	}
</script>

<div
	class={[
		'grid overflow-hidden rounded-xl border border-border bg-surface-elevated md:grid-cols-[240px_1fr]',
		className
	]}
	data-version-history
>
	<aside class="max-h-[420px] overflow-auto border-b border-border md:border-b-0 md:border-r">
		<ul class="p-2">
			{#each revisions as rev (rev.id)}
				<li>
					<button
						type="button"
						class={[
							'flex w-full flex-col gap-0.5 rounded-lg px-2.5 py-2 text-left transition-colors',
							selected?.id === rev.id
								? 'bg-brand-50 dark:bg-brand-950/40'
								: 'hover:bg-surface-overlay'
						]}
						onclick={() => pick(rev)}
					>
						<div class="flex items-center justify-between gap-2">
							<span class="truncate text-sm font-medium text-primary">{rev.label}</span>
							<VersionTag version={rev.label} prefix="" />
						</div>
						{#if rev.author || rev.createdAt}
							<p class="text-[11px] text-muted">
								{#if rev.author}{rev.author} · {/if}
								{#if rev.createdAt}
									<TimeAgo date={rev.createdAt} />
								{/if}
							</p>
						{/if}
						{#if rev.summary}
							<p class="truncate text-[11px] text-secondary">{rev.summary}</p>
						{/if}
					</button>
				</li>
			{/each}
			{#if !revisions.length}
				<li class="px-2 py-6 text-center text-xs text-muted">No revisions</li>
			{/if}
		</ul>
	</aside>

	<section class="flex min-h-0 flex-col gap-2 p-3">
		{#if selected}
			<div class="flex items-center justify-between gap-2">
				<div>
					<p class="text-sm font-semibold text-primary">{selected.label}</p>
					{#if selected.summary}
						<p class="text-xs text-muted">{selected.summary}</p>
					{/if}
				</div>
				<Button size="sm" variant="secondary" onclick={() => onrestore?.(selected)}>
					Restore
				</Button>
			</div>
			<DiffViewer
				before={selected.previousContent ?? selected.content ?? ''}
				after={currentContent || selected.content || ''}
				mode="split"
				class="min-h-[280px] flex-1"
			/>
		{:else}
			<p class="py-12 text-center text-sm text-muted">Select a revision</p>
		{/if}
	</section>
</div>
