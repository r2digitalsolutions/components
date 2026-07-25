<script lang="ts">
	import FileManager from './FileManager.svelte';
	import type { FileManagerView } from './FileManager.svelte';
	import AppShell from '$lib/components/organisms/AppShell/AppShell.svelte';
	import type { SidebarGroup } from '$lib/components/organisms/Sidebar/Sidebar.svelte';

	interface Props {
		variant?: 'default' | 'grid' | 'empty' | 'details' | 'no-sidebar' | 'app-shell';
	}

	let { variant = 'default' }: Props = $props();
	let view = $state<FileManagerView>(variant === 'grid' ? 'grid' : 'list');
	let folderId = $state(variant === 'empty' ? 'design' : 'all');
	let last = $state('');

	/** App sidebar owns navigation — FileManager has no inner folder sidebar */
	const shellGroups: SidebarGroup[] = [
		{
			id: 'library',
			label: 'Library',
			items: [
				{ id: 'all', label: 'All files' },
				{ id: 'starred', label: 'Starred' },
				{ id: 'recent', label: 'Recent' }
			]
		},
		{
			id: 'folders',
			label: 'Folders',
			items: [
				{ id: 'design', label: 'Design' },
				{ id: 'docs', label: 'Docs' },
				{ id: 'exports', label: 'Exports' },
				{ id: 'archive', label: 'Archive' }
			]
		}
	];

	function handlers() {
		return {
			onupload: () => (last = 'upload'),
			ondownload: (f: { name: string }) => (last = `dl:${f.name}`),
			ondelete: (ids: string[]) => (last = `del:${ids.length}`),
			onopen: (f: { name: string }) => (last = `open:${f.name}`),
			onfolderchange: (id: string) => (last = `nav:${id}`)
		};
	}
</script>

{#if variant === 'app-shell'}
	<div class="p-2">
		<p class="mb-2 px-2 text-xs text-muted">
			Una sola sidebar (AppShell). El FileManager va a la derecha sin carpeta duplicada.
		</p>
		<AppShell
			brand="Acme Drive"
			sidebarGroups={shellGroups}
			bind:sidebarValue={folderId}
			fullHeight={false}
			framed
			showNavbar={false}
			mainClass="!p-0 overflow-hidden"
		>
			<FileManager
				bind:view
				bind:folderId
				showSidebar={false}
				showDetails
				class="h-full min-h-[28rem] rounded-none border-0 shadow-none"
				{...handlers()}
			/>
		</AppShell>
		{#if last}
			<p class="mt-2 text-center text-xs text-muted">Action: {last}</p>
		{/if}
	</div>
{:else}
	<div class="space-y-2 p-4">
		{#if variant === 'details'}
			<p class="text-xs text-muted">
				Haz click en un archivo → panel de <strong class="text-secondary">details a la derecha</strong>.
			</p>
		{:else if variant === 'no-sidebar'}
			<p class="text-xs text-muted">Sin sidebar de carpetas — solo content.</p>
		{:else}
			<p class="text-xs text-muted">
				Layout: <strong class="text-secondary">sidebar left</strong> (All / Starred / Folders) +
				<strong class="text-secondary"> content right</strong>.
			</p>
		{/if}

		{#if variant === 'empty'}
			<FileManager
				bind:view
				bind:folderId
				files={[]}
				showSidebar
				showDetails={false}
				{...handlers()}
			/>
		{:else if variant === 'no-sidebar'}
			<FileManager
				bind:view
				bind:folderId
				showSidebar={false}
				showDetails={false}
				{...handlers()}
			/>
		{:else if variant === 'details'}
			<FileManager bind:view bind:folderId showSidebar showDetails {...handlers()} />
		{:else}
			<FileManager bind:view bind:folderId showSidebar showDetails {...handlers()} />
		{/if}

		{#if last}
			<p class="text-center text-xs text-muted">Action: {last}</p>
		{/if}
	</div>
{/if}
