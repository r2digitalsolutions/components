<script lang="ts">
	import TreePanel, { type TreePanelNode } from './TreePanel.svelte';

	let {
		showMeta = false,
		empty = false
	}: {
		showMeta?: boolean;
		empty?: boolean;
	} = $props();

	const catalog: TreePanelNode[] = [
		{
			id: 'products',
			label: 'Productos',
			children: [
				{ id: 'lighting', label: 'Iluminación', meta: 1 },
				{ id: 'furniture', label: 'Mobiliario', meta: 2 }
			]
		},
		{
			id: 'services',
			label: 'Servicios',
			children: [
				{ id: 'consulting', label: 'Consultoría', meta: 1 },
				{ id: 'renovation', label: 'Reforma', meta: 2 }
			]
		}
	];

	let collapsedIds = $state<string[]>([]);
	let lastAction = $state('—');
</script>

<div class="max-w-2xl">
	<TreePanel
		items={empty ? [] : catalog}
		bind:collapsedIds
		{showMeta}
		emptyMessage="No hay categorías todavía."
		hierarchyLabel="Jerarquía"
		metaLabel="Orden"
		actionsLabel="Acciones"
		addChildLabel="Añadir subcategoría"
		editLabel="Editar"
		deleteLabel="Eliminar"
		onAddChild={(node) => (lastAction = `Añadir hijo de ${node.label}`)}
		onEdit={(node) => (lastAction = `Editar ${node.label}`)}
		onDelete={(node) => (lastAction = `Eliminar ${node.label}`)}
	/>
	<p class="mt-3 text-xs text-secondary">
		Última acción: <span class="font-medium text-primary">{lastAction}</span>
	</p>
</div>
