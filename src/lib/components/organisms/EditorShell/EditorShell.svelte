<script lang="ts">
	import type { Snippet } from 'svelte';
	import SplitPane from '$lib/components/molecules/SplitPane/SplitPane.svelte';
	import Panel from '$lib/components/molecules/Panel/Panel.svelte';

	interface EditorShellProps {
		sidebarTitle?: string;
		inspectorTitle?: string;
		workspaceTitle?: string;
		bottomTitle?: string;
		sidebarSize?: number;
		inspectorSize?: number;
		/** Height % of the bottom content pane */
		bottomSize?: number;
		showBottom?: boolean;
		showInspector?: boolean;
		showSidebar?: boolean;
		fullHeight?: boolean;
		class?: string;
		sidebar?: Snippet;
		workspace?: Snippet;
		bottom?: Snippet;
		inspector?: Snippet;
	}

	let {
		sidebarTitle = 'Outliner',
		inspectorTitle = 'Details',
		workspaceTitle = 'Viewport',
		bottomTitle = 'Content Browser',
		sidebarSize = $bindable(22),
		inspectorSize = $bindable(28),
		bottomSize = $bindable(28),
		showBottom = true,
		showInspector = true,
		showSidebar = true,
		fullHeight = true,
		class: className = '',
		sidebar,
		workspace,
		bottom,
		inspector
	}: EditorShellProps = $props();
</script>

<div
	class={[
		'min-h-0 min-w-0 overflow-hidden bg-surface',
		fullHeight && 'h-full',
		className
	]}
>
	{#if showSidebar}
		<SplitPane
			orientation="horizontal"
			bind:size={sidebarSize}
			minSize={12}
			maxSize={40}
			class="h-full"
		>
			{#snippet start()}
				<Panel title={sidebarTitle}>
					{#if sidebar}
						{@render sidebar()}
					{/if}
				</Panel>
			{/snippet}
			{#snippet end()}
				{@render mainAndInspector()}
			{/snippet}
		</SplitPane>
	{:else}
		{@render mainAndInspector()}
	{/if}
</div>

{#snippet mainAndInspector()}
	{#if showInspector}
		<SplitPane
			orientation="horizontal"
			bind:size={inspectorSize}
			sizePane="end"
			minSize={18}
			maxSize={45}
			class="h-full"
		>
			{#snippet start()}
				{@render centerColumn()}
			{/snippet}
			{#snippet end()}
				<Panel title={inspectorTitle} padding="none">
					{#if inspector}
						{@render inspector()}
					{/if}
				</Panel>
			{/snippet}
		</SplitPane>
	{:else}
		{@render centerColumn()}
	{/if}
{/snippet}

{#snippet centerColumn()}
	{#if showBottom}
		<SplitPane
			orientation="vertical"
			bind:size={bottomSize}
			sizePane="end"
			minSize={15}
			maxSize={55}
			class="h-full"
		>
			{#snippet start()}
				<Panel title={workspaceTitle}>
					{#if workspace}
						{@render workspace()}
					{/if}
				</Panel>
			{/snippet}
			{#snippet end()}
				<Panel title={bottomTitle}>
					{#if bottom}
						{@render bottom()}
					{/if}
				</Panel>
			{/snippet}
		</SplitPane>
	{:else}
		<Panel title={workspaceTitle}>
			{#if workspace}
				{@render workspace()}
			{/if}
		</Panel>
	{/if}
{/snippet}
