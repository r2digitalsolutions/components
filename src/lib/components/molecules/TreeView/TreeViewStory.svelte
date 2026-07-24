<script lang="ts">
	import TreeView, { type TreeNode } from './TreeView.svelte';

	let {
		multiExpand = true,
		disabled = false
	}: {
		multiExpand?: boolean;
		disabled?: boolean;
	} = $props();

	const items: TreeNode[] = [
		{
			id: 'src',
			label: 'src',
			icon: '📁',
			children: [
				{
					id: 'components',
					label: 'components',
					icon: '📁',
					children: [
						{ id: 'button', label: 'Button.svelte', icon: '📄' },
						{ id: 'input', label: 'Input.svelte', icon: '📄' },
						{ id: 'badge', label: 'Badge.svelte', icon: '📄' }
					]
				},
				{
					id: 'lib',
					label: 'lib',
					icon: '📁',
					children: [
						{ id: 'utils', label: 'utils.ts', icon: '📄' },
						{ id: 'types', label: 'types.ts', icon: '📄', disabled: true }
					]
				},
				{ id: 'appsvelte', label: 'App.svelte', icon: '📄' },
				{ id: 'main', label: 'main.ts', icon: '📄' }
			]
		},
		{
			id: 'public',
			label: 'public',
			icon: '📁',
			children: [
				{ id: 'indexhtml', label: 'index.html', icon: '📄' },
				{ id: 'favicon', label: 'favicon.ico', icon: '🖼️' }
			]
		},
		{ id: 'pkgjson', label: 'package.json', icon: '📄' },
		{ id: 'readme', label: 'README.md', icon: '📄' }
	];

	let expanded = $state<string[]>(['src', 'components']);
	let selected = $state('button');
</script>

<div class="w-72 rounded-xl border border-border bg-surface-elevated p-3">
	<TreeView
		{items}
		bind:expanded
		bind:selected
		{multiExpand}
	/>
	<p class="mt-3 border-t border-border pt-2 text-xs text-muted">
		Seleccionado: <span class="text-primary font-medium">{selected || '—'}</span>
	</p>
</div>
