<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import TreeView from '$lib/components/molecules/TreeView/TreeView.svelte';
	import type { TreeNode } from '$lib/components/molecules/TreeView/TreeView.svelte';
	import FileRow from '$lib/components/molecules/FileRow/FileRow.svelte';
	import type { FileRowData } from '$lib/components/molecules/FileRow/FileRow.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import BulkActionBar from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';

	interface FileManagerProps {
		folders?: TreeNode[];
		files?: FileRowData[];
		folderId?: string;
		class?: string;
		onupload?: () => void;
		onfolderchange?: (id: string) => void;
	}

	let {
		folders = [
			{
				id: 'root',
				label: 'Workspace',
				children: [
					{ id: 'design', label: 'Design' },
					{ id: 'docs', label: 'Docs' },
					{ id: 'exports', label: 'Exports' }
				]
			}
		],
		files = $bindable<FileRowData[]>([
			{ id: 'f1', name: 'brand-guidelines.pdf', size: '2.4 MB', type: 'PDF', status: 'ready' },
			{ id: 'f2', name: 'hero.png', size: '840 KB', type: 'PNG', status: 'ready' },
			{ id: 'f3', name: 'q3-report.xlsx', size: '1.1 MB', type: 'XLSX', status: 'ready' }
		]),
		folderId = $bindable('design'),
		class: className = '',
		onupload,
		onfolderchange
	}: FileManagerProps = $props();

	let query = $state('');
	let selected = $state<string[]>([]);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return files;
		return files.filter((f) => f.name.toLowerCase().includes(q));
	});

	function toggle(id: string, checked: boolean) {
		selected = checked ? [...selected, id] : selected.filter((x) => x !== id);
	}
</script>

<Card class={['overflow-hidden', className].filter(Boolean).join(' ')} padding="none" chrome={false}>
	<div class="grid min-h-[22rem] lg:grid-cols-[14rem_1fr]">
		<aside class="border-b border-border p-3 lg:border-b-0 lg:border-r">
			<Heading level={4} size="xs" class="mb-2 text-muted">Folders</Heading>
			<TreeView
				items={folders}
				bind:selected={folderId}
				expanded={['root']}
				onselect={(id) => onfolderchange?.(id)}
			/>
		</aside>

		<section class="relative flex flex-col gap-3 p-3 sm:p-4">
			<div class="flex flex-col gap-2 sm:flex-row sm:items-center">
				<div class="min-w-0 flex-1">
					<SearchInput bind:value={query} placeholder="Search files…" size="sm" />
				</div>
				<Button size="sm" onclick={() => onupload?.()}>Upload</Button>
			</div>

			{#if filtered.length === 0}
				<EmptyState title="No files" description="Upload files or pick another folder." class="border-0 bg-transparent" />
			{:else}
				<Stack gap="sm">
					{#each filtered as file (file.id)}
						<div class="flex items-start gap-2">
							<div class="pt-3">
								<Checkbox
									checked={selected.includes(file.id)}
									onchange={(c) => toggle(file.id, c)}
									label={`Select ${file.name}`}
									class="sr-only-label"
								/>
							</div>
							<div class="min-w-0 flex-1">
								<FileRow
									{file}
									ondownload={() => {}}
									onremove={(f) => {
										files = files.filter((x) => x.id !== f.id);
										selected = selected.filter((id) => id !== f.id);
									}}
								/>
							</div>
						</div>
					{/each}
				</Stack>
			{/if}

			<BulkActionBar
				count={selected.length}
				onclear={() => (selected = [])}
				onaction={(id) => {
					if (id === 'delete') {
						files = files.filter((f) => !selected.includes(f.id));
						selected = [];
					}
				}}
			/>
		</section>
	</div>
</Card>

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
