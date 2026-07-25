<script lang="ts">
	import { onDestroy } from 'svelte';
	import Upload from '@lucide/svelte/icons/upload';
	import FileIcon from '@lucide/svelte/icons/file';
	import FileText from '@lucide/svelte/icons/file-text';
	import X from '@lucide/svelte/icons/x';
	import ImageIcon from '@lucide/svelte/icons/image';

	export interface DropZoneFile {
		id: string;
		file: File;
		previewUrl?: string;
	}

	interface DropZoneProps {
		files?: File[];
		label?: string;
		hint?: string;
		accept?: string;
		/** Allow selecting more than one file (default true). */
		multiple?: boolean;
		/** Cap on how many files can be kept when multiple. */
		maxFiles?: number;
		disabled?: boolean;
		maxSizeMb?: number;
		/** Show image thumbnails / file cards for selected files. */
		showPreview?: boolean;
		class?: string;
		ondropfiles?: (files: File[]) => void;
		onchange?: (files: File[]) => void;
		onremove?: (file: File) => void;
	}

	let {
		files = $bindable([] as File[]),
		label = 'Drop files here',
		hint = 'or click to browse',
		accept,
		multiple = true,
		maxFiles,
		disabled = false,
		maxSizeMb = 25,
		showPreview = true,
		class: className = '',
		ondropfiles,
		onchange,
		onremove
	}: DropZoneProps = $props();

	let dragging = $state(false);
	let error = $state('');
	let inputEl = $state<HTMLInputElement | null>(null);
	let depth = $state(0);
	let items = $state<DropZoneFile[]>([]);
	const previewUrls = new Set<string>();

	const maxBytes = $derived(maxSizeMb * 1024 * 1024);

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
	}

	function revokeAll() {
		for (const url of previewUrls) URL.revokeObjectURL(url);
		previewUrls.clear();
	}

	function toItem(file: File): DropZoneFile {
		const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`;
		let previewUrl: string | undefined;
		if (file.type.startsWith('image/')) {
			previewUrl = URL.createObjectURL(file);
			previewUrls.add(previewUrl);
		}
		return { id, file, previewUrl };
	}

	function syncFromFiles(next: File[]) {
		revokeAll();
		items = next.map(toItem);
		files = next;
		onchange?.(next);
	}

	function matchesAccept(file: File): boolean {
		if (!accept || accept === '*') return true;
		const rules = accept.split(',').map((r) => r.trim().toLowerCase()).filter(Boolean);
		const name = file.name.toLowerCase();
		const type = file.type.toLowerCase();
		return rules.some((rule) => {
			if (rule.startsWith('.')) return name.endsWith(rule);
			if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
			return type === rule || name.endsWith(`.${rule}`);
		});
	}

	function pick(list: FileList | File[] | null) {
		if (!list || disabled) return;
		const incoming = Array.from(list);
		if (!incoming.length) return;

		const rejectedAccept = incoming.find((f) => !matchesAccept(f));
		if (rejectedAccept) {
			error = `"${rejectedAccept.name}" is not an accepted file type`;
			return;
		}

		const tooBig = incoming.find((f) => f.size > maxBytes);
		if (tooBig) {
			error = `"${tooBig.name}" exceeds ${maxSizeMb}MB`;
			return;
		}

		error = '';

		let next: File[];
		if (multiple) {
			const merged = [...files, ...incoming];
			const seen = new Set<string>();
			next = merged.filter((f) => {
				const key = `${f.name}-${f.size}-${f.lastModified}`;
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			});
			if (maxFiles !== undefined && next.length > maxFiles) {
				error = `Maximum ${maxFiles} files allowed`;
				next = next.slice(0, maxFiles);
			}
		} else {
			next = incoming.slice(0, 1);
		}

		syncFromFiles(next);
		ondropfiles?.(next);

		if (inputEl) inputEl.value = '';
	}

	function removeAt(id: string) {
		const target = items.find((i) => i.id === id);
		if (!target) return;
		if (target.previewUrl) {
			URL.revokeObjectURL(target.previewUrl);
			previewUrls.delete(target.previewUrl);
		}
		const next = files.filter((f) => f !== target.file);
		items = items.filter((i) => i.id !== id);
		files = next;
		onchange?.(next);
		onremove?.(target.file);
		error = '';
	}

	function clearAll() {
		revokeAll();
		items = [];
		files = [];
		onchange?.([]);
		error = '';
		if (inputEl) inputEl.value = '';
	}

	function onDragEnter(e: DragEvent) {
		e.preventDefault();
		if (disabled) return;
		depth += 1;
		dragging = true;
	}

	function onDragLeave(e: DragEvent) {
		e.preventDefault();
		depth = Math.max(0, depth - 1);
		if (depth === 0) dragging = false;
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		depth = 0;
		dragging = false;
		pick(e.dataTransfer?.files ?? null);
	}

	function fileKindIcon(file: File) {
		if (file.type.startsWith('image/')) return ImageIcon;
		if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return FileText;
		return FileIcon;
	}

	onDestroy(() => revokeAll());

	$effect(() => {
		// Keep internal items in sync if parent replaces `files` externally.
		const externalKeys = files.map((f) => `${f.name}-${f.size}-${f.lastModified}`).join('|');
		const internalKeys = items.map((i) => `${i.file.name}-${i.file.size}-${i.file.lastModified}`).join('|');
		if (externalKeys !== internalKeys) {
			revokeAll();
			items = files.map(toItem);
		}
	});
</script>

<div class={['w-full space-y-3', className]}>
	<button
		type="button"
		class={[
			'flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors',
			dragging
				? 'border-brand-500 bg-brand-500/5'
				: 'border-border bg-surface-overlay/40 hover:border-border-strong hover:bg-surface-overlay',
			disabled && 'cursor-not-allowed opacity-50'
		]}
		{disabled}
		onclick={() => inputEl?.click()}
		ondragenter={onDragEnter}
		ondragleave={onDragLeave}
		ondragover={onDragOver}
		ondrop={onDrop}
	>
		<div
			class={[
				'flex h-11 w-11 items-center justify-center rounded-xl',
				dragging
					? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
					: 'bg-surface-elevated text-muted ring-1 ring-border'
			]}
		>
			<Upload class="h-5 w-5" aria-hidden="true" />
		</div>
		<div>
			<p class="text-sm font-medium text-primary">{label}</p>
			<p class="mt-0.5 text-xs text-muted">
				{hint}{#if multiple} · multiple{/if}
				{#if maxSizeMb} · max {maxSizeMb}MB{/if}
			</p>
		</div>
		<input
			bind:this={inputEl}
			type="file"
			class="sr-only"
			{accept}
			{multiple}
			{disabled}
			onchange={(e) => pick((e.currentTarget as HTMLInputElement).files)}
		/>
	</button>

	{#if error}
		<p class="text-xs text-red-600 dark:text-red-400">{error}</p>
	{/if}

	{#if showPreview && items.length}
		<div class="flex items-center justify-between gap-2">
			<p class="text-xs font-medium text-muted">
				{items.length} file{items.length === 1 ? '' : 's'} selected
			</p>
			<button
				type="button"
				class="text-xs font-medium text-muted hover:text-primary"
				{disabled}
				onclick={clearAll}
			>
				Clear all
			</button>
		</div>

		<ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each items as item (item.id)}
				{@const KindIcon = fileKindIcon(item.file)}
				<li
					class="flex items-center gap-3 rounded-xl border border-border bg-surface-elevated p-2 pr-2.5 shadow-sm"
				>
					{#if item.previewUrl}
						<img
							src={item.previewUrl}
							alt={item.file.name}
							class="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-border"
						/>
					{:else}
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-overlay text-muted ring-1 ring-border"
						>
							<KindIcon class="h-5 w-5" aria-hidden="true" />
						</div>
					{/if}

					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium text-primary">{item.file.name}</p>
						<p class="mt-0.5 text-[11px] text-muted">
							{formatBytes(item.file.size)}
							{#if item.file.type}
								· {item.file.type.split('/').pop()}
							{/if}
						</p>
					</div>

					<button
						type="button"
						class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-overlay hover:text-primary disabled:opacity-40"
						aria-label={`Remove ${item.file.name}`}
						{disabled}
						onclick={() => removeAt(item.id)}
					>
						<X class="h-4 w-4" aria-hidden="true" />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
