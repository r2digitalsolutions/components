<script lang="ts">
	import type { FileRowData } from '$lib/components/molecules/FileRow/FileRow.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import BulkActionBar from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';
	import DropZone from '$lib/components/molecules/DropZone/DropZone.svelte';
	import Breadcrumb from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Folder from '@lucide/svelte/icons/folder';
	import FolderOpen from '@lucide/svelte/icons/folder-open';
	import Upload from '@lucide/svelte/icons/upload';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import LayoutList from '@lucide/svelte/icons/layout-list';
	import FileIcon from '@lucide/svelte/icons/file';
	import FileText from '@lucide/svelte/icons/file-text';
	import FileImage from '@lucide/svelte/icons/file-image';
	import FileSpreadsheet from '@lucide/svelte/icons/file-spreadsheet';
	import Download from '@lucide/svelte/icons/download';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Star from '@lucide/svelte/icons/star';
	import Clock from '@lucide/svelte/icons/clock';
	import Files from '@lucide/svelte/icons/files';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import PanelRight from '@lucide/svelte/icons/panel-right';
	import X from '@lucide/svelte/icons/x';

	export type FileManagerView = 'list' | 'grid';
	export type FileManagerSort = 'name' | 'modified' | 'size' | 'type';

	export interface FileManagerFolder {
		id: string;
		label: string;
		parentId?: string | null;
	}

	export interface FileManagerItem extends FileRowData {
		folderId?: string;
		modified?: string;
		starred?: boolean;
	}

	interface FileManagerProps {
		title?: string;
		folders?: FileManagerFolder[];
		files?: FileManagerItem[];
		/** Active nav: `all` | `starred` | `recent` | folder id */
		folderId?: string;
		view?: FileManagerView;
		sort?: FileManagerSort;
		showSidebar?: boolean;
		/** Right details pane when a single file is focused */
		showDetails?: boolean;
		showDropZone?: boolean;
		class?: string;
		onupload?: (files?: File[]) => void;
		onfolderchange?: (id: string) => void;
		ondownload?: (file: FileManagerItem) => void;
		ondelete?: (ids: string[]) => void;
		onopen?: (file: FileManagerItem) => void;
	}

	const DEFAULT_FOLDERS: FileManagerFolder[] = [
		{ id: 'design', label: 'Design' },
		{ id: 'docs', label: 'Docs' },
		{ id: 'exports', label: 'Exports' },
		{ id: 'archive', label: 'Archive' }
	];

	const DEFAULT_FILES: FileManagerItem[] = [
		{
			id: 'f1',
			name: 'brand-guidelines.pdf',
			size: '2.4 MB',
			type: 'PDF',
			status: 'ready',
			folderId: 'docs',
			modified: 'Jul 22, 2026',
			starred: true
		},
		{
			id: 'f2',
			name: 'hero.png',
			size: '840 KB',
			type: 'PNG',
			status: 'ready',
			folderId: 'design',
			modified: 'Jul 24, 2026'
		},
		{
			id: 'f3',
			name: 'q3-report.xlsx',
			size: '1.1 MB',
			type: 'XLSX',
			status: 'ready',
			folderId: 'exports',
			modified: 'Jul 18, 2026'
		},
		{
			id: 'f4',
			name: 'moodboard.jpg',
			size: '3.2 MB',
			type: 'JPG',
			status: 'ready',
			folderId: 'design',
			modified: 'Jul 20, 2026',
			starred: true
		},
		{
			id: 'f5',
			name: 'release-notes.md',
			size: '12 KB',
			type: 'MD',
			status: 'uploading',
			progress: 62,
			folderId: 'docs',
			modified: 'Just now'
		},
		{
			id: 'f6',
			name: 'old-deck.pptx',
			size: '8.5 MB',
			type: 'PPTX',
			status: 'ready',
			folderId: 'archive',
			modified: 'Mar 2, 2026'
		}
	];

	let {
		title = 'Files',
		folders = DEFAULT_FOLDERS,
		files = $bindable<FileManagerItem[]>([...DEFAULT_FILES]),
		folderId = $bindable('all'),
		view = $bindable<FileManagerView>('list'),
		sort = $bindable<FileManagerSort>('name'),
		showSidebar = true,
		showDetails = true,
		showDropZone = true,
		class: className = '',
		onupload,
		onfolderchange,
		ondownload,
		ondelete,
		onopen
	}: FileManagerProps = $props();

	let query = $state('');
	let selected = $state<string[]>([]);
	let focusedId = $state<string | null>(null);
	let sidebarOpen = $state(true);
	let detailsOpen = $state(true);
	let showUploader = $state(false);
	let dropFiles = $state<File[]>([]);

	const folderCounts = $derived.by(() => {
		const map = new Map<string, number>();
		for (const f of files) {
			if (!f.folderId) continue;
			map.set(f.folderId, (map.get(f.folderId) ?? 0) + 1);
		}
		return map;
	});

	const navLabel = $derived.by(() => {
		if (folderId === 'all') return 'All files';
		if (folderId === 'starred') return 'Starred';
		if (folderId === 'recent') return 'Recent';
		return folders.find((f) => f.id === folderId)?.label ?? 'Files';
	});

	const crumbs = $derived.by((): BreadcrumbItem[] => {
		if (folderId === 'all') return [{ id: 'all', label: 'All files' }];
		return [
			{ id: 'all', label: 'Files' },
			{ id: `nav-${folderId}`, label: navLabel }
		];
	});

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		let list: FileManagerItem[] = [];
		if (folderId === 'all') list = [...files];
		else if (folderId === 'starred') list = files.filter((f) => f.starred);
		else if (folderId === 'recent')
			list = [...files].sort((a, b) => (b.modified ?? '').localeCompare(a.modified ?? '')).slice(0, 8);
		else list = files.filter((f) => f.folderId === folderId);

		if (q) list = list.filter((f) => f.name.toLowerCase().includes(q));

		if (folderId !== 'recent') {
			list.sort((a, b) => {
				if (sort === 'modified') return (b.modified ?? '').localeCompare(a.modified ?? '');
				if (sort === 'type') return (a.type ?? '').localeCompare(b.type ?? '');
				if (sort === 'size') return (a.size ?? '').localeCompare(b.size ?? '');
				return a.name.localeCompare(b.name);
			});
		}
		return list;
	});

	const focused = $derived(
		focusedId ? (files.find((f) => f.id === focusedId) ?? null) : null
	);

	const detailsVisible = $derived(
		showDetails && detailsOpen && Boolean(focused) && selected.length <= 1
	);

	const allSelected = $derived(
		filtered.length > 0 && filtered.every((f) => selected.includes(f.id))
	);

	function fileIcon(type?: string) {
		const t = (type ?? '').toUpperCase();
		if (['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'SVG'].includes(t)) return FileImage;
		if (['XLS', 'XLSX', 'CSV'].includes(t)) return FileSpreadsheet;
		if (['PDF', 'DOC', 'DOCX', 'MD', 'TXT'].includes(t)) return FileText;
		return FileIcon;
	}

	function iconTone(type?: string) {
		const t = (type ?? '').toUpperCase();
		if (['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'SVG'].includes(t))
			return 'bg-violet-500/10 text-violet-600 dark:text-violet-400';
		if (['XLS', 'XLSX', 'CSV'].includes(t))
			return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
		if (t === 'PDF') return 'bg-red-500/10 text-red-600 dark:text-red-400';
		return 'bg-sky-500/10 text-sky-600 dark:text-sky-400';
	}

	function go(id: string) {
		folderId = id;
		selected = [];
		focusedId = null;
		onfolderchange?.(id);
		if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
			sidebarOpen = false;
		}
	}

	function toggle(id: string, checked: boolean) {
		selected = checked ? [...new Set([...selected, id])] : selected.filter((x) => x !== id);
		if (checked) focusedId = id;
	}

	function toggleAll(checked: boolean) {
		selected = checked ? filtered.map((f) => f.id) : [];
	}

	function focusFile(file: FileManagerItem) {
		focusedId = file.id;
		onopen?.(file);
	}

	function removeIds(ids: string[]) {
		files = files.filter((f) => !ids.includes(f.id));
		selected = selected.filter((id) => !ids.includes(id));
		if (focusedId && ids.includes(focusedId)) focusedId = null;
		ondelete?.(ids);
	}

	function onDrop(newFiles: File[]) {
		const mapped: FileManagerItem[] = newFiles.map((f, i) => ({
			id: `up-${Date.now()}-${i}`,
			name: f.name,
			size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
			type: f.name.split('.').pop()?.toUpperCase() ?? 'FILE',
			status: 'ready' as const,
			folderId: folderId === 'all' || folderId === 'starred' || folderId === 'recent' ? 'docs' : folderId,
			modified: 'Just now'
		}));
		files = [...mapped, ...files];
		showUploader = false;
		dropFiles = [];
		onupload?.(newFiles);
	}

	function navBtn(active: boolean) {
		return [
			'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition',
			active
				? 'bg-brand-500/10 font-medium text-brand-700 dark:text-brand-300'
				: 'text-secondary hover:bg-surface-overlay hover:text-primary'
		];
	}
</script>

<div
	class={[
		'flex min-h-[30rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
>
	<!-- Top toolbar (spans full width) -->
	<header
		class="flex flex-col gap-3 border-b border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4"
	>
		<div class="flex min-w-0 items-center gap-2">
			{#if showSidebar}
				<button
					type="button"
					class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface-overlay hover:text-primary lg:hidden"
					onclick={() => (sidebarOpen = !sidebarOpen)}
					aria-label="Toggle sidebar"
					aria-pressed={sidebarOpen}
				>
					<PanelLeft class="h-4 w-4" strokeWidth={2} />
				</button>
			{/if}
			<div class="min-w-0">
				<p class="text-sm font-semibold text-primary">{title}</p>
				<Breadcrumb
					items={crumbs}
					class="mt-0.5 text-xs"
					onnavigate={(id) => go(id === 'all' ? 'all' : id.replace(/^nav-/, ''))}
				/>
			</div>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<div class="min-w-[10rem] flex-1 sm:max-w-xs sm:flex-none">
				<SearchInput bind:value={query} placeholder="Search files…" size="sm" />
			</div>
			<div class="inline-flex rounded-lg border border-border p-0.5">
				<button
					type="button"
					class={[
						'rounded-md p-1.5',
						view === 'list' ? 'bg-surface-overlay text-primary' : 'text-muted hover:text-primary'
					]}
					onclick={() => (view = 'list')}
					aria-label="List view"
					aria-pressed={view === 'list'}
				>
					<LayoutList class="h-4 w-4" strokeWidth={2} />
				</button>
				<button
					type="button"
					class={[
						'rounded-md p-1.5',
						view === 'grid' ? 'bg-surface-overlay text-primary' : 'text-muted hover:text-primary'
					]}
					onclick={() => (view = 'grid')}
					aria-label="Grid view"
					aria-pressed={view === 'grid'}
				>
					<LayoutGrid class="h-4 w-4" strokeWidth={2} />
				</button>
			</div>
			<select
				class="h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs text-secondary outline-none focus:border-brand-500"
				bind:value={sort}
				aria-label="Sort by"
			>
				<option value="name">Name</option>
				<option value="modified">Modified</option>
				<option value="type">Type</option>
				<option value="size">Size</option>
			</select>
			{#if showDetails}
				<button
					type="button"
					class={[
						'hidden h-8 w-8 items-center justify-center rounded-lg border border-border md:inline-flex',
						detailsOpen ? 'bg-surface-overlay text-primary' : 'text-muted hover:text-primary'
					]}
					onclick={() => (detailsOpen = !detailsOpen)}
					aria-label="Toggle details"
					aria-pressed={detailsOpen}
				>
					<PanelRight class="h-4 w-4" strokeWidth={2} />
				</button>
			{/if}
			<Button size="sm" variant="secondary" onclick={() => (showUploader = !showUploader)}>
				<Upload class="h-3.5 w-3.5" strokeWidth={2} />
				Upload
			</Button>
		</div>
	</header>

	<!-- Body: LEFT sidebar | RIGHT content (+ optional details) -->
	<div
		class={[
			'grid min-h-0 flex-1',
			showSidebar && sidebarOpen
				? detailsVisible
					? 'lg:grid-cols-[15rem_minmax(0,1fr)_16rem]'
					: 'lg:grid-cols-[15rem_minmax(0,1fr)]'
				: detailsVisible
					? 'lg:grid-cols-[minmax(0,1fr)_16rem]'
					: 'lg:grid-cols-1'
		]}
	>
		{#if showSidebar}
			<aside
				class={[
					'flex flex-col border-b border-border bg-surface/50 lg:border-b-0 lg:border-r',
					!sidebarOpen && 'hidden lg:flex'
				]}
				aria-label="File navigation"
			>
				<div class="flex-1 space-y-4 overflow-y-auto px-2 py-3">
					<div class="space-y-0.5">
						<p class="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
							Library
						</p>
						<button type="button" class={navBtn(folderId === 'all')} onclick={() => go('all')}>
							<Files class="h-4 w-4 shrink-0" strokeWidth={2} />
							<span class="min-w-0 flex-1 truncate">All files</span>
							<span class="text-[11px] tabular-nums text-muted">{files.length}</span>
						</button>
						<button
							type="button"
							class={navBtn(folderId === 'starred')}
							onclick={() => go('starred')}
						>
							<Star class="h-4 w-4 shrink-0" strokeWidth={2} />
							<span class="min-w-0 flex-1 truncate">Starred</span>
							<span class="text-[11px] tabular-nums text-muted"
								>{files.filter((f) => f.starred).length}</span
							>
						</button>
						<button
							type="button"
							class={navBtn(folderId === 'recent')}
							onclick={() => go('recent')}
						>
							<Clock class="h-4 w-4 shrink-0" strokeWidth={2} />
							<span class="min-w-0 flex-1 truncate">Recent</span>
						</button>
					</div>

					<div class="space-y-0.5">
						<p class="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
							Folders
						</p>
						{#each folders as folder (folder.id)}
							<button
								type="button"
								class={navBtn(folderId === folder.id)}
								onclick={() => go(folder.id)}
							>
								{#if folderId === folder.id}
									<FolderOpen class="h-4 w-4 shrink-0 text-brand-500" strokeWidth={2} />
								{:else}
									<Folder class="h-4 w-4 shrink-0" strokeWidth={2} />
								{/if}
								<span class="min-w-0 flex-1 truncate">{folder.label}</span>
								<span class="text-[11px] tabular-nums text-muted"
									>{folderCounts.get(folder.id) ?? 0}</span
								>
							</button>
						{/each}
					</div>
				</div>
				<div class="border-t border-border px-3 py-2.5">
					<p class="text-[11px] text-muted">{filtered.length} shown · {files.length} total</p>
				</div>
			</aside>
		{/if}

		<!-- Main content -->
		<section class="relative flex min-h-0 min-w-0 flex-col border-border lg:border-r">
			{#if showDropZone && showUploader}
				<div class="border-b border-border p-3 sm:p-4">
					<DropZone
						bind:files={dropFiles}
						label="Drop files to upload"
						hint="PNG, PDF, XLSX up to 25MB"
						ondropfiles={onDrop}
						showPreview={false}
					/>
				</div>
			{/if}

			<div
				class="flex items-center justify-between gap-2 border-b border-border/70 px-3 py-2 sm:px-4"
			>
				<p class="text-xs font-medium text-secondary">
					{navLabel}
					<span class="text-muted">· {filtered.length}</span>
				</p>
			</div>

			{#if filtered.length === 0}
				<div class="flex flex-1 items-center justify-center p-6">
					<EmptyState
						title="Nothing here"
						description="Upload files or pick another folder from the sidebar."
						class="border-0 bg-transparent shadow-none"
					>
						{#snippet action()}
							<Button size="sm" onclick={() => (showUploader = true)}>Upload files</Button>
						{/snippet}
					</EmptyState>
				</div>
			{:else if view === 'list'}
				<div class="min-h-0 flex-1 overflow-auto">
					<table class="w-full min-w-[32rem] text-left text-sm">
						<thead
							class="sticky top-0 z-10 border-b border-border bg-surface-elevated/95 backdrop-blur"
						>
							<tr class="text-[11px] uppercase tracking-wide text-muted">
								<th class="w-10 px-3 py-2.5">
									<Checkbox
										checked={allSelected}
										onchange={toggleAll}
										label="Select all"
										class="sr-only-label"
									/>
								</th>
								<th class="px-2 py-2.5 font-semibold">Name</th>
								<th class="hidden px-2 py-2.5 font-semibold sm:table-cell">Modified</th>
								<th class="px-2 py-2.5 font-semibold">Size</th>
								<th class="hidden px-2 py-2.5 font-semibold md:table-cell">Type</th>
								<th class="w-24 px-3 py-2.5"><span class="sr-only">Actions</span></th>
							</tr>
						</thead>
						<tbody>
							{#each filtered as file (file.id)}
								{@const Icon = fileIcon(file.type)}
								<tr
									class={[
										'group cursor-pointer border-b border-border/70 transition last:border-0',
										focusedId === file.id || selected.includes(file.id)
											? 'bg-brand-500/5'
											: 'hover:bg-surface-overlay/50'
									]}
									onclick={() => focusFile(file)}
								>
									<td class="px-3 py-2.5" onclick={(e) => e.stopPropagation()}>
										<Checkbox
											checked={selected.includes(file.id)}
											onchange={(c) => toggle(file.id, c)}
											label={`Select ${file.name}`}
											class="sr-only-label"
										/>
									</td>
									<td class="px-2 py-2.5">
										<div class="flex min-w-0 items-center gap-2.5">
											<span
												class={[
													'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
													iconTone(file.type)
												]}
											>
												<Icon class="h-4 w-4" strokeWidth={2} />
											</span>
											<span class="min-w-0">
												<span class="flex items-center gap-1.5">
													<span class="truncate font-medium text-primary">{file.name}</span>
													{#if file.starred}
														<Star
															class="h-3 w-3 shrink-0 fill-amber-400 text-amber-400"
															strokeWidth={0}
														/>
													{/if}
												</span>
												{#if file.status === 'uploading'}
													<span class="text-[11px] text-sky-600 dark:text-sky-400"
														>Uploading {file.progress ?? 0}%</span
													>
												{/if}
											</span>
										</div>
									</td>
									<td class="hidden px-2 py-2.5 text-muted sm:table-cell"
										>{file.modified ?? '—'}</td
									>
									<td class="px-2 py-2.5 tabular-nums text-muted">{file.size ?? '—'}</td>
									<td class="hidden px-2 py-2.5 md:table-cell">
										{#if file.type}
											<Badge size="sm" variant="secondary">{file.type}</Badge>
										{/if}
									</td>
									<td class="px-3 py-2.5" onclick={(e) => e.stopPropagation()}>
										<div
											class="flex justify-end gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
										>
											<button
												type="button"
												class="rounded-lg p-1.5 text-muted hover:bg-surface-overlay hover:text-primary"
												aria-label="Download"
												onclick={() => ondownload?.(file)}
											>
												<Download class="h-4 w-4" strokeWidth={2} />
											</button>
											<button
												type="button"
												class="rounded-lg p-1.5 text-muted hover:bg-surface-overlay hover:text-red-600"
												aria-label="Delete"
												onclick={() => removeIds([file.id])}
											>
												<Trash2 class="h-4 w-4" strokeWidth={2} />
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div
					class="grid flex-1 grid-cols-2 content-start gap-3 overflow-auto p-3 sm:grid-cols-3 xl:grid-cols-4"
				>
					{#each filtered as file (file.id)}
						{@const Icon = fileIcon(file.type)}
						<button
							type="button"
							class={[
								'flex flex-col rounded-xl border p-3 text-left transition',
								focusedId === file.id || selected.includes(file.id)
									? 'border-brand-500/40 bg-brand-500/5'
									: 'border-border bg-surface hover:border-border-strong'
							]}
							onclick={() => focusFile(file)}
						>
							<div class="mb-3 flex items-start justify-between gap-2">
								<span
									class={[
										'flex h-11 w-11 items-center justify-center rounded-xl',
										iconTone(file.type)
									]}
								>
									<Icon class="h-5 w-5" strokeWidth={2} />
								</span>
								<span onclick={(e) => e.stopPropagation()}>
									<Checkbox
										checked={selected.includes(file.id)}
										onchange={(c) => toggle(file.id, c)}
										label={`Select ${file.name}`}
										class="sr-only-label"
									/>
								</span>
							</div>
							<p class="truncate text-sm font-medium text-primary">{file.name}</p>
							<p class="mt-0.5 text-[11px] text-muted">
								{file.size ?? '—'} · {file.modified ?? file.type}
							</p>
						</button>
					{/each}
				</div>
			{/if}

			<BulkActionBar
				count={selected.length}
				total={filtered.length}
				itemLabel="file"
				itemLabelPlural="files"
				placement="inline"
				actions={[
					{ id: 'download', label: 'Download', variant: 'secondary' },
					{ id: 'delete', label: 'Delete', variant: 'destructive', confirm: true }
				]}
				onclear={() => (selected = [])}
				onselectall={() => toggleAll(true)}
				onaction={(id) => {
					if (id === 'delete') removeIds(selected);
					if (id === 'download') {
						for (const f of files.filter((x) => selected.includes(x.id))) ondownload?.(f);
					}
				}}
			/>
		</section>

		<!-- Details panel (right) -->
		{#if detailsVisible && focused}
			{@const Icon = fileIcon(focused.type)}
			<aside
				class="hidden min-h-0 flex-col border-t border-border bg-surface/30 md:flex lg:border-t-0"
				aria-label="File details"
			>
				<div class="flex items-center justify-between border-b border-border px-3 py-2.5">
					<p class="text-xs font-semibold uppercase tracking-wide text-muted">Details</p>
					<button
						type="button"
						class="rounded-lg p-1 text-muted hover:bg-surface-overlay hover:text-primary"
						onclick={() => (focusedId = null)}
						aria-label="Close details"
					>
						<X class="h-4 w-4" strokeWidth={2} />
					</button>
				</div>
				<div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
					<div class="flex flex-col items-center gap-3 text-center">
						<span
							class={[
								'flex h-16 w-16 items-center justify-center rounded-2xl',
								iconTone(focused.type)
							]}
						>
							<Icon class="h-7 w-7" strokeWidth={2} />
						</span>
						<div class="min-w-0">
							<p class="truncate text-sm font-semibold text-primary">{focused.name}</p>
							{#if focused.type}
								<Badge size="sm" variant="secondary" class="mt-1">{focused.type}</Badge>
							{/if}
						</div>
					</div>

					<dl class="space-y-2 text-xs">
						<div class="flex justify-between gap-2">
							<dt class="text-muted">Size</dt>
							<dd class="font-medium text-secondary">{focused.size ?? '—'}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-muted">Modified</dt>
							<dd class="font-medium text-secondary">{focused.modified ?? '—'}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-muted">Status</dt>
							<dd class="font-medium capitalize text-secondary">{focused.status ?? 'ready'}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-muted">Folder</dt>
							<dd class="font-medium text-secondary">
								{folders.find((f) => f.id === focused.folderId)?.label ?? '—'}
							</dd>
						</div>
					</dl>

					<div class="mt-auto flex flex-col gap-2">
						<Button size="sm" onclick={() => ondownload?.(focused)}>Download</Button>
						<Button
							size="sm"
							variant="destructive"
							onclick={() => removeIds([focused.id])}
						>
							Delete
						</Button>
					</div>
				</div>
			</aside>
		{/if}
	</div>
</div>

<style>
	:global(.sr-only-label label) {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
