<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import LabeledProgress from '$lib/components/atoms/LabeledProgress/LabeledProgress.svelte';

	export type UploadQueueStatus = 'uploading' | 'done' | 'error';

	export interface UploadQueueFile {
		id: string;
		name: string;
		progress: number;
		status: UploadQueueStatus;
		error?: string;
	}

	interface UploadQueueProps {
		files?: UploadQueueFile[];
		class?: string;
		onretry?: (id: string) => void;
		onremove?: (id: string) => void;
	}

	const {
		files = [],
		class: className = '',
		onretry,
		onremove
	}: UploadQueueProps = $props();

	const statusVariant: Record<UploadQueueStatus, 'info' | 'success' | 'error'> = {
		uploading: 'info',
		done: 'success',
		error: 'error'
	};

	const statusLabel: Record<UploadQueueStatus, string> = {
		uploading: 'Uploading',
		done: 'Done',
		error: 'Failed'
	};
</script>

<ul class={['space-y-2', className]} aria-label="Upload queue">
	{#each files as file (file.id)}
		<li
			class="rounded-xl border border-border bg-surface-elevated px-3 py-2.5"
		>
			<div class="flex items-center gap-3">
				<span
					class={[
						'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
						file.status === 'error'
							? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
							: 'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400'
					]}
					aria-hidden="true"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
						<path stroke-linecap="round" stroke-linejoin="round" d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M14 3v5h5" />
					</svg>
				</span>

				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-2">
						<p class="truncate text-sm font-medium text-primary">{file.name}</p>
						<Badge size="sm" variant={statusVariant[file.status]}>
							{statusLabel[file.status]}
						</Badge>
					</div>
					{#if file.status === 'error' && file.error}
						<p class="mt-0.5 text-xs text-red-600 dark:text-red-400">{file.error}</p>
					{/if}
				</div>

				<div class="flex shrink-0 items-center gap-0.5">
					{#if file.status === 'error' && onretry}
						<IconButton label="Retry upload" size="sm" variant="ghost" onclick={() => onretry(file.id)}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0115.5-3M20 15a9 9 0 01-15.5 3" />
							</svg>
						</IconButton>
					{/if}
					{#if onremove}
						<IconButton label="Remove file" size="sm" variant="ghost" onclick={() => onremove(file.id)}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</IconButton>
					{/if}
				</div>
			</div>

			{#if file.status === 'uploading'}
				<div class="mt-2">
					<LabeledProgress label="Uploading" value={file.progress} showValue />
				</div>
			{/if}
		</li>
	{/each}
</ul>
