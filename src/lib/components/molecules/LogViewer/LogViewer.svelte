<script lang="ts">
	import ScrollArea from '$lib/components/atoms/ScrollArea/ScrollArea.svelte';
	import Code from '$lib/components/atoms/Code/Code.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Surface from '$lib/components/atoms/Surface/Surface.svelte';
	import Time from '$lib/components/atoms/Time/Time.svelte';

	export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

	export interface LogEntry {
		id: string;
		level: LogLevel;
		message: string;
		time?: Date | string | number;
		source?: string;
	}

	interface LogViewerProps {
		entries?: LogEntry[];
		maxHeight?: string;
		class?: string;
	}

	const { entries = [], maxHeight = '20rem', class: className = '' }: LogViewerProps = $props();

	const levelVariant: Record<LogLevel, 'secondary' | 'info' | 'warning' | 'error'> = {
		debug: 'secondary',
		info: 'info',
		warn: 'warning',
		error: 'error'
	};
</script>

<Surface variant="elevated" padding="none" radius="xl" class={['overflow-hidden font-mono', className].filter(Boolean).join(' ')}>
	<div class="border-b border-border px-3 py-2 text-xs font-medium text-muted">Logs</div>
	<ScrollArea {maxHeight}>
		<ul class="divide-y divide-border">
			{#each entries as entry (entry.id)}
				<li class="flex items-start gap-2 px-3 py-2 text-xs">
					{#if entry.time}
						<span class="shrink-0 text-muted">
							<Time date={entry.time} format="time" class="text-xs text-muted" />
						</span>
					{/if}
					<Badge size="sm" variant={levelVariant[entry.level]}>{entry.level}</Badge>
					{#if entry.source}
						<Code size="sm">{entry.source}</Code>
					{/if}
					<span class="min-w-0 flex-1 break-words text-primary">{entry.message}</span>
				</li>
			{:else}
				<li class="px-3 py-8 text-center text-muted">No log entries</li>
			{/each}
		</ul>
	</ScrollArea>
</Surface>
