<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import LabeledProgress from '$lib/components/atoms/LabeledProgress/LabeledProgress.svelte';

	export interface FileRowData {
		id: string;
		name: string;
		size?: string;
		type?: string;
		progress?: number;
		status?: 'ready' | 'uploading' | 'error';
	}

	interface FileRowProps {
		file: FileRowData;
		class?: string;
		ondownload?: (file: FileRowData) => void;
		onremove?: (file: FileRowData) => void;
	}

	const { file, class: className = '', ondownload, onremove }: FileRowProps = $props();

	const statusVariant: Record<NonNullable<FileRowData['status']>, 'secondary' | 'info' | 'error'> = {
		ready: 'secondary',
		uploading: 'info',
		error: 'error'
	};
</script>

<div
	class={[
		'flex flex-col gap-2 rounded-xl border border-border bg-surface-elevated px-3 py-2.5',
		className
	]}
>
	<div class="flex items-center gap-3">
		<div
			class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
				/>
				<path stroke-linecap="round" stroke-linejoin="round" d="M14 3v5h5" />
			</svg>
		</div>

		<div class="min-w-0 flex-1">
			<p class="truncate text-sm font-medium text-primary">{file.name}</p>
			<div class="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted">
				{#if file.size}<span>{file.size}</span>{/if}
				{#if file.type}<span>{file.type}</span>{/if}
				{#if file.status}
					<Badge size="sm" variant={statusVariant[file.status]}>{file.status}</Badge>
				{/if}
			</div>
		</div>

		<div class="flex shrink-0 items-center gap-1">
			{#if ondownload}
				<IconButton label="Download" size="sm" variant="ghost" onclick={() => ondownload(file)}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
					</svg>
				</IconButton>
			{/if}
			{#if onremove}
				<IconButton label="Remove" size="sm" variant="ghost" onclick={() => onremove(file)}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</IconButton>
			{/if}
		</div>
	</div>

	{#if file.status === 'uploading' && file.progress != null}
		<LabeledProgress label="Uploading" value={file.progress} showValue={false} />
	{/if}
</div>
