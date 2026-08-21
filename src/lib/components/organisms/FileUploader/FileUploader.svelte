<script lang="ts">
	import { onDestroy } from 'svelte';
	import { i18n } from '$lib/utils/i18n.svelte.js';

	type FileKind = 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'other';
	type UploaderVariant = 'multiple' | 'single' | 'avatar';
	type UploaderView = 'list' | 'grid';
	/** Dropzone chrome layout (ignored for avatar / filled single preview). */
	type UploaderLayout = 'horizontal' | 'vertical' | 'compact';

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
		/**
		 * Empty dropzone orientation.
		 * - `horizontal` — icon + text in a row (default)
		 * - `vertical` — stacked, better for narrow sidebars
		 * - `compact` — tight horizontal strip
		 */
		layout?: UploaderLayout;
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
		label,
		helperText,
		accept = 'image/*',
		variant = 'multiple',
		view = $bindable('list'),
		layout = 'horizontal',
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
	const resolvedLabel = $derived(label ?? i18n.t('uploadFiles'));
	const resolvedHelperText = $derived(helperText ?? i18n.t('uploadHelper'));
	const primaryFile = $derived(fileList[0] as FileItem | undefined);
	const externalSrc = $derived(src?.trim() || '');
	const showSinglePreview = $derived(variant === 'single' && (!!primaryFile || !!externalSrc));
	const singlePreviewUrl = $derived(primaryFile?.previewUrl || externalSrc);
	const singlePreviewName = $derived(primaryFile?.name || srcName || i18n.t('media'));
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
	const singleIsAudio = $derived(
		primaryFile?.kind === 'audio' ||
			(!primaryFile &&
				!!externalSrc &&
				(resolvedAccept.includes('audio') ||
					/\.(mp3|wav|ogg|m4a|aac|flac)(\?|$)/i.test(externalSrc)))
	);
	const dropLayout = $derived(layout === 'compact' ? 'compact' : layout);

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
		if (kind === 'image')
			return 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300';
		if (kind === 'video')
			return 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300';
		if (kind === 'audio')
			return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300';
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
				rejected.push(i18n.t('imageRequired', { name: file.name }));
				continue;
			}
			if (!matchesAccept(file)) {
				rejected.push(i18n.t('typeNotAllowed', { name: file.name }));
				continue;
			}
			if (file.size > maxBytes) {
				rejected.push(i18n.t('exceedsMaxSize', { name: file.name, max: maxSizeMb }));
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
			'font-bold tracking-wide flex items-center justify-center text-[10px] uppercase',
			kindBadgeClass(kind),
			className
		]}
		aria-hidden="true"
	>
		{kindLabel(kind)}
	</div>
{/snippet}

{#snippet dropzone(forceCompact = false)}
	{@const compact = forceCompact || dropLayout === 'compact'}
	{@const vertical = !compact && dropLayout === 'vertical'}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		role="button"
		tabindex={disabled ? -1 : 0}
		aria-labelledby={resolvedLabel ? labelId : undefined}
		aria-describedby={[resolvedHelperText ? helperId : '', errorMessage ? errorId : '']
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
			'focus-visible:ring-brand-500/30 focus-visible:border-brand-500 focus-visible:ring-2',
			'rounded-xl',
			isDragging
				? 'border-brand-500 bg-brand-500/5 dark:bg-brand-950/40'
				: 'border-border bg-surface-elevated hover:border-border-strong hover:bg-surface-overlay/60',
			disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
		]}
	>
		<div
			class={[
				'flex',
				vertical
					? 'gap-2 px-3 py-5 flex-col items-center text-center'
					: compact
						? 'gap-3 px-3 py-2.5 flex-row items-center'
						: 'gap-4 px-4 py-5 sm:px-5 flex-row items-center'
			]}
		>
			<div
				class={[
					'rounded-lg flex shrink-0 items-center justify-center transition-colors duration-150',
					vertical ? 'h-10 w-10' : compact ? 'h-8 w-8' : 'h-11 w-11',
					isDragging
						? 'bg-brand-600 text-white'
						: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
				]}
				aria-hidden="true"
			>
				<svg
					class={compact ? 'h-3.5 w-3.5' : 'h-5 w-5'}
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

			<div class={['min-w-0', vertical ? 'w-full' : 'flex-1 text-left']}>
				<p
					class={[
						'font-medium text-primary',
						compact || vertical ? 'text-xs' : 'text-sm',
						vertical && 'text-center'
					]}
				>
					{#if isDragging}
						{i18n.t('dropToUpload')}
					{:else}
						{i18n.t('dropOrBrowse')}
						<span class="text-brand-700 dark:text-brand-300"> {i18n.t('browse')}</span>
					{/if}
				</p>
				{#if resolvedHelperText}
					<p
						id={helperId}
						class={['mt-0.5 leading-relaxed text-secondary text-[11px]', vertical && 'text-center']}
					>
						{resolvedHelperText}
					</p>
				{/if}
			</div>

			{#if !disabled && !compact && !vertical}
				<span
					class="sm:inline-flex rounded-lg border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-primary pointer-events-none hidden shrink-0 items-center border"
				>
					{i18n.t('browseButton')}
				</span>
			{/if}
		</div>

		{#if isDragging}
			<div
				class="inset-0 ring-brand-500/40 rounded-xl pointer-events-none absolute ring-2 ring-inset"
				aria-hidden="true"
			></div>
		{/if}
	</div>
{/snippet}

<div class={['gap-3 flex w-full flex-col', className]}>
	<input
		bind:this={fileInputNode}
		{id}
		type="file"
		accept={resolvedAccept}
		multiple={isMultiple}
		{disabled}
		class="sr-only"
		onchange={handleInputChange}
		tabindex={-1}
		aria-hidden="true"
	/>

	{#if resolvedLabel}
		<div class="gap-3 flex items-center justify-between">
			<div id={labelId} class="text-sm font-medium text-primary">{resolvedLabel}</div>

			{#if isMultiple && hasFile}
				<div class="gap-2 flex items-center">
					{#if showViewToggle}
						<div
							class="rounded-lg border-border bg-surface-elevated p-0.5 inline-flex items-center border"
							role="group"
							aria-label={i18n.t('viewMode')}
						>
							<button
								type="button"
								onclick={() => (view = 'list')}
								class={[
									'rounded-md p-1.5 transition-colors',
									view === 'list' ? 'bg-brand-600 text-white' : 'text-secondary hover:text-primary'
								]}
								aria-pressed={view === 'list'}
								aria-label={i18n.t('listView')}
							>
								<svg
									class="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							</button>
							<button
								type="button"
								onclick={() => (view = 'grid')}
								class={[
									'rounded-md p-1.5 transition-colors',
									view === 'grid' ? 'bg-brand-600 text-white' : 'text-secondary hover:text-primary'
								]}
								aria-pressed={view === 'grid'}
								aria-label={i18n.t('gridView')}
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
									<path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
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
							{i18n.t('clearAll')}
						</button>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Avatar variant -->
	{#if variant === 'avatar'}
		<div class="gap-4 flex items-center">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				role="button"
				tabindex={disabled ? -1 : 0}
				aria-labelledby={resolvedLabel ? labelId : undefined}
				aria-describedby={resolvedHelperText ? helperId : undefined}
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
					'group h-24 w-24 relative shrink-0 overflow-hidden rounded-full border-2 border-dashed transition-colors outline-none',
					'focus-visible:ring-brand-500/30 focus-visible:border-brand-500 focus-visible:ring-2',
					isDragging
						? 'border-brand-500 bg-brand-500/10'
						: hasFile || externalSrc
							? 'border-transparent'
							: 'border-border bg-surface-elevated hover:border-border-strong',
					disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
				]}
			>
				{#if primaryFile?.previewUrl || externalSrc}
					<img
						src={primaryFile?.previewUrl || externalSrc}
						alt=""
						class="h-full w-full object-cover"
					/>
					{#if !disabled}
						<div
							class="inset-0 bg-black/45 absolute flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
						>
							<span
								class="h-8 w-8 bg-white text-primary shadow-sm inline-flex items-center justify-center rounded-full"
								aria-hidden="true"
							>
								<svg
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
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
					<div class="gap-1 text-secondary flex h-full w-full flex-col items-center justify-center">
						<svg
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="1.75"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"
							/>
						</svg>
						<span class="font-medium text-[10px]">{i18n.t('upload')}</span>
					</div>
				{/if}
			</div>

			<div class="min-w-0 flex-1">
				{#if primaryFile}
					<p class="text-sm font-medium text-primary truncate">{primaryFile.name}</p>
					<p class="text-xs text-secondary">{primaryFile.sizeFormatted}</p>
					<div class="mt-2 gap-2 flex items-center">
						<button
							type="button"
							onclick={openPicker}
							{disabled}
							class="gap-1.5 rounded-lg border-border bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-surface-overlay inline-flex items-center border transition-colors disabled:opacity-50"
						>
							<svg
								class="h-3.5 w-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
								/>
							</svg>
							{i18n.t('change')}
						</button>
						<button
							type="button"
							onclick={() => primaryFile && removeFile(primaryFile.id)}
							{disabled}
							class="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 inline-flex items-center transition-colors disabled:opacity-50"
						>
							{i18n.t('remove')}
						</button>
					</div>
				{:else}
					<p class="text-sm font-medium text-primary">{i18n.t('addProfilePhoto')}</p>
					{#if resolvedHelperText}
						<p id={helperId} class="mt-0.5 text-xs text-secondary">{resolvedHelperText}</p>
					{/if}
				{/if}
			</div>
		</div>

		<!-- Single variant: preview card with edit -->
	{:else if showSinglePreview}
		<div
			class={[
				'rounded-xl border-border bg-surface-elevated shadow-sm overflow-hidden border',
				isDragging && 'ring-brand-500/40 ring-2'
			]}
			ondragenter={handleDragEnter}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			role="group"
			aria-labelledby={resolvedLabel ? labelId : undefined}
		>
			<div class="aspect-video bg-surface-overlay relative">
				{#if singlePreviewUrl && singleIsVideo}
					<video src={singlePreviewUrl} class="h-full w-full object-cover" muted playsinline
					></video>
				{:else if singlePreviewUrl && singleIsAudio}
					<div class="gap-3 px-4 flex h-full w-full flex-col items-center justify-center">
						{@render fileBadge('audio', 'h-14 w-14 rounded-xl text-xs')}
						<audio src={singlePreviewUrl} controls class="max-w-xs w-full"></audio>
					</div>
				{:else if singlePreviewUrl}
					<img src={singlePreviewUrl} alt="" class="h-full w-full object-cover" />
				{:else}
					<div class="gap-2 flex h-full w-full flex-col items-center justify-center">
						{@render fileBadge(primaryFile?.kind ?? 'other', 'h-14 w-14 rounded-xl text-xs')}
					</div>
				{/if}

				{#if !disabled}
					<div class="right-3 top-3 gap-1.5 absolute flex items-center">
						<button
							type="button"
							onclick={openPicker}
							class="gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur hover:bg-white dark:bg-slate-900/95 dark:hover:bg-slate-900 inline-flex items-center transition"
						>
							<svg
								class="h-3.5 w-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
								/>
							</svg>
							{i18n.t('edit')}
						</button>
						<button
							type="button"
							onclick={clearSingle}
							class="rounded-lg bg-white/95 p-1.5 text-secondary shadow-sm backdrop-blur hover:bg-white hover:text-red-600 dark:bg-slate-900/95 dark:hover:bg-slate-900 dark:hover:text-red-400 inline-flex items-center justify-center transition"
							aria-label={i18n.t('removeNamed', { name: singlePreviewName })}
						>
							<svg
								class="h-3.5 w-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				{/if}
			</div>

			<div class="gap-3 border-border px-4 py-3 flex items-center justify-between border-t">
				<div class="min-w-0">
					<p class="text-sm font-medium text-primary truncate">{singlePreviewName}</p>
					{#if singlePreviewMeta}
						<p class="text-xs text-secondary">{singlePreviewMeta}</p>
					{/if}
				</div>
				{#if resolvedHelperText}
					<p id={helperId} class="text-xs text-secondary shrink-0">{resolvedHelperText}</p>
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
			<ul class="gap-2.5 sm:grid-cols-3 grid grid-cols-2" aria-label={i18n.t('selectedFiles')}>
				{#each fileList as item (item.id)}
					<li
						class="group rounded-xl border-border bg-surface-elevated shadow-sm hover:border-border-strong relative overflow-hidden border transition"
					>
						<div class="bg-surface-overlay relative aspect-square">
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
									class="right-2 top-2 h-7 w-7 rounded-lg bg-white/95 text-secondary shadow-sm backdrop-blur hover:text-red-600 dark:bg-slate-900/95 dark:hover:text-red-400 absolute inline-flex items-center justify-center opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
									aria-label={i18n.t('removeNamed', { name: item.name })}
								>
									<svg
										class="h-3.5 w-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							{/if}
						</div>
						<div class="border-border px-2.5 py-2 border-t">
							<p class="text-xs font-medium text-primary truncate">{item.name}</p>
							<p class="text-xs text-secondary">{item.sizeFormatted}</p>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<ul class="gap-2 flex flex-col" aria-label={i18n.t('selectedFiles')}>
				{#each fileList as item (item.id)}
					<li
						class="group gap-3 rounded-xl border-border bg-surface-elevated p-2.5 shadow-sm hover:border-border-strong flex items-center border transition"
					>
						{#if item.previewUrl}
							<img
								src={item.previewUrl}
								alt=""
								class="h-12 w-12 rounded-lg border-border shrink-0 border object-cover"
							/>
						{:else}
							{@render fileBadge(item.kind, 'h-12 w-12 shrink-0 rounded-lg')}
						{/if}

						<div class="min-w-0 flex-1">
							<p class="text-sm font-medium text-primary truncate">{item.name}</p>
							<p class="text-xs text-secondary">{item.sizeFormatted} · {kindLabel(item.kind)}</p>
						</div>

						<button
							type="button"
							onclick={() => removeFile(item.id)}
							{disabled}
							class="rounded-lg p-2 text-secondary hover:bg-red-50 hover:text-red-600 focus-visible:ring-brand-500/30 dark:hover:bg-red-950/40 dark:hover:text-red-400 shrink-0 transition focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
							aria-label={i18n.t('removeNamed', { name: item.name })}
						>
							<svg
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
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
