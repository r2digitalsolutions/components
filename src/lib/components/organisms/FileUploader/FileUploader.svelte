<script lang="ts">
	import { onDestroy } from 'svelte';

	type FileKind = 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'other';
	type UploaderVariant = 'multiple' | 'single' | 'avatar';
	type UploaderView = 'list' | 'grid';

	interface FileItem {
		file: File;
		id: string;
		name: string;
		sizeFormatted: string;
		previewUrl?: string;
		kind: FileKind;
	}

	interface FileUploaderProps {
		id?: string;
		label?: string;
		helperText?: string;
		accept?: string;
		variant?: UploaderVariant;
		view?: UploaderView;
		showViewToggle?: boolean;
		/** When false, only the dropzone is shown (parent owns the file list). */
		showFileList?: boolean;
		maxSizeMb?: number;
		disabled?: boolean;
		/**
		 * External preview URL for `single` / `avatar` when no File is selected yet
		 * (e.g. existing remote image in an editor inspector).
		 */
		src?: string;
		/** Display name when using `src` without a File */
		srcName?: string;
		class?: string;
		onchange?: (files: File[]) => void;
		/** Fired when the user clears the current file / src preview */
		onclear?: () => void;
	}

	let {
		id = `upload-${Math.random().toString(36).slice(2, 9)}`,
		label = 'Upload files',
		helperText = 'SVG, PNG, JPG or GIF (max. 10MB)',
		accept = 'image/*',
		variant = 'multiple',
		view = $bindable('list'),
		showViewToggle = true,
		showFileList = true,
		maxSizeMb = 10,
		disabled = false,
		src = '',
		srcName = '',
		class: className = '',
		onchange,
		onclear
	}: FileUploaderProps = $props();

	let isDragging = $state(false);
	let fileList = $state<FileItem[]>([]);
	let errorMessage = $state('');
	let fileInputNode = $state<HTMLInputElement | null>(null);
	let dragDepth = $state(0);

	const isMultiple = $derived(variant === 'multiple');
	const hasFile = $derived(fileList.length > 0);
	const primaryFile = $derived(fileList[0] as FileItem | undefined);
	const externalSrc = $derived(src?.trim() || '');
	const showSinglePreview = $derived(
		variant === 'single' && (!!primaryFile || !!externalSrc)
	);
	const singlePreviewUrl = $derived(primaryFile?.previewUrl || externalSrc);
	const singlePreviewName = $derived(primaryFile?.name || srcName || 'Media');
	const singlePreviewMeta = $derived(primaryFile?.sizeFormatted || '');

	const labelId = $derived(`${id}-label`);
	const helperId = $derived(`${id}-helper`);
	const errorId = $derived(`${id}-error`);
	const maxBytes = $derived(maxSizeMb * 1024 * 1024);

	const resolvedAccept = $derived(
		variant === 'avatar' && (!accept || accept === '*') ? 'image/*' : accept
	);

	const singleIsVideo = $derived(
		primaryFile?.kind === 'video' ||
			(!primaryFile &&
				!!externalSrc &&
				(resolvedAccept.includes('video') || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(externalSrc)))
	);

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
	}

	function getFileKind(file: File): FileKind {
		if (file.type.startsWith('image/')) return 'image';
		if (file.type.startsWith('video/')) return 'video';
		if (file.type.startsWith('audio/')) return 'audio';
		if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'pdf';
		if (
			file.type.includes('document') ||
			file.type.includes('word') ||
			/\.(docx?|odt|rtf)$/i.test(file.name)
		) {
			return 'doc';
		}
		return 'other';
	}

	function kindLabel(kind: FileKind) {
		if (kind === 'pdf') return 'PDF';
		if (kind === 'doc') return 'DOC';
		if (kind === 'image') return 'IMG';
		if (kind === 'video') return 'VID';
		if (kind === 'audio') return 'AUD';
		return 'FILE';
	}

	function kindBadgeClass(kind: FileKind) {
		if (kind === 'pdf') return 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300';
		if (kind === 'doc') return 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300';
		if (kind === 'image') return 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300';
		if (kind === 'video') return 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300';
		if (kind === 'audio') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300';
		return 'bg-surface-overlay text-secondary';
	}

	function matchesAccept(file: File): boolean {
		const rules = resolvedAccept;
		if (!rules || rules === '*') return true;

		return rules.split(',').some((raw) => {
			const rule = raw.trim().toLowerCase();
			if (!rule) return false;
			if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule);
			if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
			return file.type.toLowerCase() === rule;
		});
	}

	function revokePreviews(items: FileItem[]) {
		for (const item of items) {
			if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
		}
	}

	function openPicker() {
		if (!disabled) fileInputNode?.click();
	}

	function addFiles(files: FileList | File[]) {
		if (disabled) return;

		const incoming = Array.from(files);
		const nextItems: FileItem[] = [];
		const rejected: string[] = [];

		for (const file of incoming) {
			if (variant === 'avatar' && !file.type.startsWith('image/')) {
				rejected.push(`${file.name}: se requiere una imagen`);
				continue;
			}
			if (!matchesAccept(file)) {
				rejected.push(`${file.name}: tipo no permitido`);
				continue;
			}
			if (file.size > maxBytes) {
				rejected.push(`${file.name}: supera ${maxSizeMb}MB`);
				continue;
			}

			const kind = getFileKind(file);
			const needsUrl = kind === 'image' || kind === 'video' || kind === 'audio';
			nextItems.push({
				file,
				id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
				name: file.name,
				sizeFormatted: formatBytes(file.size),
				kind,
				previewUrl: needsUrl ? URL.createObjectURL(file) : undefined
			});
		}

		if (nextItems.length === 0 && rejected.length > 0) {
			errorMessage = rejected[0];
			return;
		}

		errorMessage = rejected.length > 0 ? rejected[0] : '';

		if (!isMultiple) {
			revokePreviews(fileList);
			fileList = nextItems.slice(0, 1);
		} else {
			const existingKeys = new Set(
				fileList.map((f) => `${f.name}-${f.file.size}-${f.file.lastModified}`)
			);
			const unique = nextItems.filter(
				(item) => !existingKeys.has(`${item.name}-${item.file.size}-${item.file.lastModified}`)
			);
			fileList = [...fileList, ...unique];
		}

		onchange?.(fileList.map((item) => item.file));
		if (!showFileList && isMultiple) {
			revokePreviews(fileList);
			fileList = [];
		}
		if (fileInputNode) fileInputNode.value = '';
	}

	function removeFile(id: string) {
		const removed = fileList.find((item) => item.id === id);
		if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
		fileList = fileList.filter((item) => item.id !== id);
		errorMessage = '';
		onchange?.(fileList.map((item) => item.file));
		if (fileList.length === 0) onclear?.();
	}

	function clearSingle() {
		if (primaryFile) {
			removeFile(primaryFile.id);
			return;
		}
		errorMessage = '';
		onchange?.([]);
		onclear?.();
	}

	function clearAll() {
		revokePreviews(fileList);
		fileList = [];
		errorMessage = '';
		onchange?.([]);
		if (fileInputNode) fileInputNode.value = '';
	}

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		if (disabled) return;
		dragDepth += 1;
		isDragging = true;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		dragDepth = Math.max(0, dragDepth - 1);
		if (dragDepth === 0) isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragDepth = 0;
		isDragging = false;
		if (disabled || !e.dataTransfer?.files?.length) return;
		addFiles(e.dataTransfer.files);
	}

	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files?.length) addFiles(target.files);
	}

	onDestroy(() => revokePreviews(fileList));
</script>

{#snippet fileBadge(kind: FileKind, className = '')}
	<div
		class={[
			'flex items-center justify-center text-[10px] font-bold uppercase tracking-wide',
			kindBadgeClass(kind),
			className
		]}
		aria-hidden="true"
	>
		{kindLabel(kind)}
	</div>
{/snippet}

{#snippet dropzone(compact = false)}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		role="button"
		tabindex={disabled ? -1 : 0}
		aria-labelledby={label ? labelId : undefined}
		aria-describedby={[helperText ? helperId : '', errorMessage ? errorId : '']
			.filter(Boolean)
			.join(' ') || undefined}
		aria-disabled={disabled || undefined}
		ondragenter={handleDragEnter}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onkeydown={(e) => {
			if (disabled) return;
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openPicker();
			}
		}}
		onclick={openPicker}
		class={[
			'relative overflow-hidden border border-dashed transition-colors duration-150 outline-none',
			'focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:border-brand-500',
			compact ? 'rounded-xl' : 'rounded-xl',
			isDragging
				? 'border-brand-500 bg-brand-500/5 dark:bg-brand-950/40'
				: 'border-border bg-surface-elevated hover:border-border-strong hover:bg-surface-overlay/60',
			disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
		]}
	>
		<div class={['flex items-center gap-4', compact ? 'px-4 py-3.5' : 'px-4 py-5 sm:px-5']}>
			<div
				class={[
					'flex shrink-0 items-center justify-center rounded-lg transition-colors duration-150',
					compact ? 'h-9 w-9' : 'h-11 w-11',
					isDragging
						? 'bg-brand-600 text-white'
						: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
				]}
				aria-hidden="true"
			>
				<svg
					class={compact ? 'h-4 w-4' : 'h-5 w-5'}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.75"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
					/>
				</svg>
			</div>

			<div class="min-w-0 flex-1 text-left">
				<p class={['font-medium text-primary', compact ? 'text-xs' : 'text-sm']}>
					{#if isDragging}
						Drop files to upload
					{:else}
						Drop files here or
						<span class="text-brand-700 dark:text-brand-300"> browse</span>
					{/if}
				</p>
				{#if helperText}
					<p
						id={helperId}
						class="mt-0.5 text-xs text-secondary leading-relaxed"
					>
						{helperText}
					</p>
				{/if}
			</div>

			{#if !disabled && !compact}
				<span
					class="hidden sm:inline-flex shrink-0 items-center rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-primary pointer-events-none"
				>
					Browse
				</span>
			{/if}
		</div>

		{#if isDragging}
			<div
				class="pointer-events-none absolute inset-0 ring-2 ring-inset ring-brand-500/40 rounded-xl"
				aria-hidden="true"
			></div>
		{/if}
	</div>
{/snippet}

<div class={['flex flex-col gap-3 w-full', className]}>
	<input
		bind:this={fileInputNode}
		id={id}
		type="file"
		accept={resolvedAccept}
		multiple={isMultiple}
		{disabled}
		class="sr-only"
		onchange={handleInputChange}
		tabindex={-1}
		aria-hidden="true"
	/>

	{#if label}
		<div class="flex items-center justify-between gap-3">
			<div id={labelId} class="text-sm font-medium text-primary">{label}</div>

			{#if isMultiple && hasFile}
				<div class="flex items-center gap-2">
					{#if showViewToggle}
						<div
							class="inline-flex items-center rounded-lg border border-border bg-surface-elevated p-0.5"
							role="group"
							aria-label="View mode"
						>
							<button
								type="button"
								onclick={() => (view = 'list')}
								class={[
									'rounded-md p-1.5 transition-colors',
									view === 'list'
										? 'bg-brand-600 text-white'
										: 'text-secondary hover:text-primary'
								]}
								aria-pressed={view === 'list'}
								aria-label="List view"
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							</button>
							<button
								type="button"
								onclick={() => (view = 'grid')}
								class={[
									'rounded-md p-1.5 transition-colors',
									view === 'grid'
										? 'bg-brand-600 text-white'
										: 'text-secondary hover:text-primary'
								]}
								aria-pressed={view === 'grid'}
								aria-label="Grid view"
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"
									/>
								</svg>
							</button>
						</div>
					{/if}

					{#if !disabled}
						<button
							type="button"
							onclick={clearAll}
							class="text-xs font-medium text-secondary hover:text-primary transition-colors"
						>
							Clear all
						</button>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Avatar variant -->
	{#if variant === 'avatar'}
		<div class="flex items-center gap-4">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				role="button"
				tabindex={disabled ? -1 : 0}
				aria-labelledby={label ? labelId : undefined}
				aria-describedby={helperText ? helperId : undefined}
				aria-disabled={disabled || undefined}
				ondragenter={handleDragEnter}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
				onkeydown={(e) => {
					if (disabled) return;
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						openPicker();
					}
				}}
				onclick={openPicker}
				class={[
					'relative group h-24 w-24 shrink-0 rounded-full border-2 border-dashed overflow-hidden transition-colors outline-none',
					'focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:border-brand-500',
					isDragging
						? 'border-brand-500 bg-brand-500/10'
						: hasFile
							? 'border-transparent'
							: 'border-border bg-surface-elevated hover:border-border-strong',
					disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
				]}
			>
				{#if primaryFile?.previewUrl}
					<img src={primaryFile.previewUrl} alt="" class="h-full w-full object-cover" />
					{#if !disabled}
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
						>
							<span
								class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm"
								aria-hidden="true"
							>
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
									/>
								</svg>
							</span>
						</div>
					{/if}
				{:else}
					<div class="flex h-full w-full flex-col items-center justify-center gap-1 text-secondary">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"
							/>
						</svg>
						<span class="text-[10px] font-medium">Upload</span>
					</div>
				{/if}
			</div>

			<div class="min-w-0 flex-1">
				{#if primaryFile}
					<p class="truncate text-sm font-medium text-primary">{primaryFile.name}</p>
					<p class="text-xs text-secondary">{primaryFile.sizeFormatted}</p>
					<div class="mt-2 flex items-center gap-2">
						<button
							type="button"
							onclick={openPicker}
							disabled={disabled}
							class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-surface-overlay disabled:opacity-50"
						>
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
								/>
							</svg>
							Change
						</button>
						<button
							type="button"
							onclick={() => primaryFile && removeFile(primaryFile.id)}
							disabled={disabled}
							class="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 disabled:opacity-50"
						>
							Remove
						</button>
					</div>
				{:else}
					<p class="text-sm font-medium text-primary">Add a profile photo</p>
					{#if helperText}
						<p id={helperId} class="mt-0.5 text-xs text-secondary">{helperText}</p>
					{/if}
				{/if}
			</div>
		</div>

	<!-- Single variant: preview card with edit -->
	{:else if showSinglePreview}
		<div
			class={[
				'overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-sm',
				isDragging && 'ring-2 ring-brand-500/40'
			]}
			ondragenter={handleDragEnter}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			role="group"
			aria-labelledby={label ? labelId : undefined}
		>
			<div class="relative aspect-video bg-surface-overlay">
				{#if singlePreviewUrl}
					{#if singleIsVideo}
						<video
							src={singlePreviewUrl}
							class="h-full w-full object-cover"
							muted
							playsinline
						></video>
					{:else}
						<img src={singlePreviewUrl} alt="" class="h-full w-full object-cover" />
					{/if}
				{:else}
					<div class="flex h-full w-full flex-col items-center justify-center gap-2">
						{@render fileBadge(primaryFile?.kind ?? 'other', 'h-14 w-14 rounded-xl text-xs')}
					</div>
				{/if}

				{#if !disabled}
					<div class="absolute right-3 top-3 flex items-center gap-1.5">
						<button
							type="button"
							onclick={openPicker}
							class="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur transition hover:bg-white dark:bg-slate-900/95 dark:hover:bg-slate-900"
						>
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
								/>
							</svg>
							Edit
						</button>
						<button
							type="button"
							onclick={clearSingle}
							class="inline-flex items-center justify-center rounded-lg bg-white/95 p-1.5 text-secondary shadow-sm backdrop-blur transition hover:bg-white hover:text-red-600 dark:bg-slate-900/95 dark:hover:bg-slate-900 dark:hover:text-red-400"
							aria-label={`Remove ${singlePreviewName}`}
						>
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				{/if}
			</div>

			<div class="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
				<div class="min-w-0">
					<p class="truncate text-sm font-medium text-primary">{singlePreviewName}</p>
					{#if singlePreviewMeta}
						<p class="text-xs text-secondary">{singlePreviewMeta}</p>
					{/if}
				</div>
				{#if helperText}
					<p id={helperId} class="shrink-0 text-xs text-secondary">{helperText}</p>
				{/if}
			</div>
		</div>

	<!-- Dropzone: hide the big one when multiple already has files (compact “add more” below) -->
	{:else if !(isMultiple && hasFile && showFileList)}
		{@render dropzone()}
	{/if}

	{#if errorMessage}
		<p id={errorId} class="text-xs text-red-600 dark:text-red-400" role="alert">{errorMessage}</p>
	{/if}

	<!-- Multiple file cards (optional — MediaAssetBrowser owns its own grid) -->
	{#if isMultiple && hasFile && showFileList}
		{#if view === 'grid'}
			<ul class="grid grid-cols-2 gap-2.5 sm:grid-cols-3" aria-label="Selected files">
				{#each fileList as item (item.id)}
					<li
						class="group relative overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-sm transition hover:border-border-strong"
					>
						<div class="relative aspect-square bg-surface-overlay">
							{#if item.previewUrl}
								<img src={item.previewUrl} alt="" class="h-full w-full object-cover" />
							{:else}
								<div class="flex h-full w-full items-center justify-center">
									{@render fileBadge(item.kind, 'h-12 w-12 rounded-xl')}
								</div>
							{/if}

							{#if !disabled}
								<button
									type="button"
									onclick={() => removeFile(item.id)}
									class="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-secondary opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 hover:text-red-600 focus-visible:opacity-100 dark:bg-slate-900/95 dark:hover:text-red-400"
									aria-label={`Remove ${item.name}`}
								>
									<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							{/if}
						</div>
						<div class="border-t border-border px-2.5 py-2">
							<p class="truncate text-xs font-medium text-primary">{item.name}</p>
							<p class="text-xs text-secondary">{item.sizeFormatted}</p>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<ul class="flex flex-col gap-2" aria-label="Selected files">
				{#each fileList as item (item.id)}
					<li
						class="group flex items-center gap-3 rounded-xl border border-border bg-surface-elevated p-2.5 shadow-sm transition hover:border-border-strong"
					>
						{#if item.previewUrl}
							<img
								src={item.previewUrl}
								alt=""
								class="h-12 w-12 shrink-0 rounded-lg object-cover border border-border"
							/>
						{:else}
							{@render fileBadge(item.kind, 'h-12 w-12 shrink-0 rounded-lg')}
						{/if}

						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium text-primary">{item.name}</p>
							<p class="text-xs text-secondary">{item.sizeFormatted} · {kindLabel(item.kind)}</p>
						</div>

						<button
							type="button"
							onclick={() => removeFile(item.id)}
							disabled={disabled}
							class="shrink-0 rounded-lg p-2 text-secondary transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:hover:bg-red-950/40 dark:hover:text-red-400 disabled:opacity-50"
							aria-label={`Remove ${item.name}`}
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</li>
				{/each}
			</ul>
		{/if}

		{#if !disabled}
			{@render dropzone(true)}
		{/if}
	{/if}
</div>
