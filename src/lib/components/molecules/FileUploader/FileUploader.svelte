<script lang="ts">
	interface FileItem {
		file: File;
		id: string;
		name: string;
		sizeFormatted: string;
	}

	interface FileUploaderProps {
		label?: string;
		helperText?: string;
		accept?: string;
		multiple?: boolean;
		maxSizeMb?: number;
		disabled?: boolean;
		class?: string;
		onchange?: (files: File[]) => void;
	}

	let {
		label = 'Upload files',
		helperText = 'SVG, PNG, JPG or GIF (max. 10MB)',
		accept = 'image/*',
		multiple = true,
		maxSizeMb = 10,
		disabled = false,
		class: className = '',
		onchange
	}: FileUploaderProps = $props();

	let isDragging = $state(false);
	let fileList = $state<FileItem[]>([]);
	let fileInputNode = $state<HTMLInputElement | null>(null);

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
	}

	function addFiles(files: FileList | File[]) {
		const newItems: FileItem[] = [];
		for (const file of Array.from(files)) {
			if (file.size <= maxSizeMb * 1024 * 1024) {
				newItems.push({
					file,
					id: Math.random().toString(36).slice(2, 9),
					name: file.name,
					sizeFormatted: formatBytes(file.size)
				});
			}
		}

		fileList = multiple ? [...fileList, ...newItems] : newItems;
		onchange?.(fileList.map((item) => item.file));
	}

	function removeFile(id: string) {
		fileList = fileList.filter((item) => item.id !== id);
		onchange?.(fileList.map((item) => item.file));
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (disabled || !e.dataTransfer?.files) return;
		addFiles(e.dataTransfer.files);
	}

	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			addFiles(target.files);
		}
	}
</script>

<div class={['flex flex-col gap-2.5 w-full', className]}>
	{#if label}
		<span class="text-sm font-medium text-primary">{label}</span>
	{/if}

	<!-- Dropzone container -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => !disabled && fileInputNode?.click()}
		ondragover={(e) => {
			e.preventDefault();
			if (!disabled) isDragging = true;
		}}
		ondragleave={() => (isDragging = false)}
		ondrop={handleDrop}
		class={[
			'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer text-center bg-surface-elevated',
			isDragging
				? 'border-brand-500 bg-brand-500/5 dark:bg-brand-950/30'
				: 'border-border hover:border-border-strong hover:bg-surface-overlay',
			disabled && 'opacity-50 cursor-not-allowed bg-surface'
		]}
	>
		<input
			bind:this={fileInputNode}
			type="file"
			{accept}
			{multiple}
			{disabled}
			class="hidden"
			onchange={handleInputChange}
		/>

		<!-- Upload Icon -->
		<div class="h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
			</svg>
		</div>

		<p class="text-sm font-medium text-primary mb-1">
			<span class="text-brand-600 dark:text-brand-400 font-semibold underline underline-offset-2">Click to upload</span> or drag and drop
		</p>
		<p class="text-xs text-muted">{helperText}</p>
	</div>

	<!-- File list -->
	{#if fileList.length > 0}
		<div class="flex flex-col gap-2 mt-1">
			{#each fileList as item (item.id)}
				<div class="flex items-center justify-between gap-3 p-3 bg-surface-elevated border border-border rounded-lg text-sm">
					<div class="flex items-center gap-2.5 min-w-0 flex-1">
						<svg class="h-5 w-5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<div class="flex flex-col min-w-0 flex-1">
							<span class="text-xs font-medium text-primary truncate">{item.name}</span>
							<span class="text-[11px] text-muted">{item.sizeFormatted}</span>
						</div>
					</div>

					<button
						type="button"
						onclick={(e) => {
							e.stopPropagation();
							removeFile(item.id);
						}}
						class="text-muted hover:text-red-500 transition-colors p-1 rounded"
						aria-label={`Remove ${item.name}`}
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
