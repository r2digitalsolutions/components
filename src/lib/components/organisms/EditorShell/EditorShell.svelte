<script lang="ts">
	import type { Snippet } from 'svelte';
	import SplitPane from '$lib/components/molecules/SplitPane/SplitPane.svelte';
	import Panel from '$lib/components/molecules/Panel/Panel.svelte';

	interface EditorShellProps {
		sidebarTitle?: string;
		inspectorTitle?: string;
		workspaceTitle?: string;
		bottomTitle?: string;
		/** Sized-pane value (%, or px when sizeUnit is `px`). */
		sidebarSize?: number;
		inspectorSize?: number;
		/** Height of the bottom content pane */
		bottomSize?: number;
		sizeUnit?: 'percent' | 'px';
		sidebarMin?: number;
		sidebarMax?: number;
		inspectorMin?: number;
		inspectorMax?: number;
		bottomMin?: number;
		bottomMax?: number;
		showBottom?: boolean;
		showInspector?: boolean;
		showSidebar?: boolean;
		/**
		 * Wrap each slot in a Panel chrome. Set false when the slot already
		 * provides its own panels (e.g. Palette + Variables stacked).
		 */
		wrapSidebar?: boolean;
		wrapInspector?: boolean;
		wrapWorkspace?: boolean;
		wrapBottom?: boolean;
		/** Collapse chrome on dock panels (when wrapped) */
		collapsiblePanels?: boolean;
		/** Hide resize grips until hover */
		revealResizeOnHover?: boolean;
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
		sizeUnit = 'percent',
		sidebarMin = 12,
		sidebarMax = 40,
		inspectorMin = 18,
		inspectorMax = 45,
		bottomMin = 15,
		bottomMax = 55,
		showBottom = true,
		showInspector = true,
		showSidebar = true,
		wrapSidebar = true,
		wrapInspector = true,
		wrapWorkspace = true,
		wrapBottom = true,
		collapsiblePanels = true,
		revealResizeOnHover = true,
		fullHeight = true,
		class: className = '',
		sidebar,
		workspace,
		bottom,
		inspector
	}: EditorShellProps = $props();

	let sidebarCollapsed = $state(false);
	let inspectorCollapsed = $state(false);
	let workspaceCollapsed = $state(false);
	let bottomCollapsed = $state(false);
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
			unit={sizeUnit}
			minSize={sidebarMin}
			maxSize={sidebarMax}
			startCollapsed={wrapSidebar && sidebarCollapsed}
			revealOnHover={revealResizeOnHover}
			class="h-full"
		>
			{#snippet start()}
				{#if wrapSidebar}
					<Panel
						title={sidebarTitle}
						collapsible={collapsiblePanels}
						bind:collapsed={sidebarCollapsed}
						padding="none"
					>
						{#if sidebar}
							{@render sidebar()}
						{/if}
					</Panel>
				{:else if sidebar}
					<div class="h-full min-h-0 min-w-0">
						{@render sidebar()}
					</div>
				{/if}
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
	<div class="h-full min-h-0 min-w-0">
		{#if showInspector}
			<SplitPane
				orientation="horizontal"
				bind:size={inspectorSize}
				sizePane="end"
				unit={sizeUnit}
				minSize={inspectorMin}
				maxSize={inspectorMax}
				endCollapsed={wrapInspector && inspectorCollapsed}
				revealOnHover={revealResizeOnHover}
				class="h-full"
			>
				{#snippet start()}
					{@render centerColumn()}
				{/snippet}
				{#snippet end()}
					{#if wrapInspector}
						<Panel
							title={inspectorTitle}
							padding="none"
							collapsible={collapsiblePanels}
							bind:collapsed={inspectorCollapsed}
						>
							{#if inspector}
								{@render inspector()}
							{/if}
						</Panel>
					{:else if inspector}
						<div class="h-full min-h-0 min-w-0">
							{@render inspector()}
						</div>
					{/if}
				{/snippet}
			</SplitPane>
		{:else}
			{@render centerColumn()}
		{/if}
	</div>
{/snippet}

{#snippet centerColumn()}
	<div class="h-full min-h-0 min-w-0">
		{#if showBottom}
			<SplitPane
				orientation="vertical"
				bind:size={bottomSize}
				sizePane="end"
				unit={sizeUnit}
				minSize={bottomMin}
				maxSize={bottomMax}
				startCollapsed={wrapWorkspace && workspaceCollapsed}
				endCollapsed={wrapBottom && bottomCollapsed}
				revealOnHover={revealResizeOnHover}
				class="h-full"
			>
				{#snippet start()}
					{#if wrapWorkspace}
						<Panel
							title={workspaceTitle}
							padding="none"
							collapsible={collapsiblePanels}
							bind:collapsed={workspaceCollapsed}
						>
							{#if workspace}
								{@render workspace()}
							{/if}
						</Panel>
					{:else if workspace}
						<div class="h-full min-h-0 min-w-0">
							{@render workspace()}
						</div>
					{/if}
				{/snippet}
				{#snippet end()}
					{#if wrapBottom}
						<Panel
							title={bottomTitle}
							padding="none"
							collapsible={collapsiblePanels}
							bind:collapsed={bottomCollapsed}
						>
							{#if bottom}
								{@render bottom()}
							{/if}
						</Panel>
					{:else if bottom}
						<div class="h-full min-h-0 min-w-0">
							{@render bottom()}
						</div>
					{/if}
				{/snippet}
			</SplitPane>
		{:else if wrapWorkspace}
			<Panel
				title={workspaceTitle}
				padding="none"
				collapsible={collapsiblePanels}
				bind:collapsed={workspaceCollapsed}
			>
				{#if workspace}
					{@render workspace()}
				{/if}
			</Panel>
		{:else if workspace}
			<div class="h-full min-h-0 min-w-0">
				{@render workspace()}
			</div>
		{/if}
	</div>
{/snippet}
