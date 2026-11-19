<script lang="ts">
	import WorkspaceShell from './WorkspaceShell.svelte';
	import NavRail, { type NavRailItem } from '$lib/components/organisms/NavRail/NavRail.svelte';
	import SectionNav from '$lib/components/molecules/SectionNav/SectionNav.svelte';
	import BottomNav from '$lib/components/organisms/BottomNav/BottomNav.svelte';
	import {
		House,
		Store,
		Users,
		ChartColumn,
		Settings,
		Shield,
		FileText,
		Images,
		Plus,
		Menu
	} from '@lucide/svelte';

	const items: NavRailItem[] = [
		{ id: 'inicio', label: 'Inicio', icon: House, href: '#' },
		{ id: 'escaparate', label: 'Escaparate', icon: Store, href: '#' },
		{ id: 'clientes', label: 'Clientes', icon: Users, href: '#', badge: 9 },
		{ id: 'stats', label: 'Estadíst.', icon: ChartColumn, href: '#' },
		{ id: 'ajustes', label: 'Ajustes', icon: Settings, href: '#' }
	];
	let section = $state('escaparate');
</script>

<div class="rounded-xl border-border h-[40rem] overflow-hidden border">
	<WorkspaceShell>
		{#snippet rail()}
			<NavRail
				variant="solid"
				showLabels
				{items}
				footerItems={[{ id: 'admin', label: 'Admin', icon: Shield, href: '#' }]}
				bind:value={section}
			/>
		{/snippet}
		{#snippet secondary()}
			<SectionNav
				title="Escaparate"
				description="Lo que ven tus clientes"
				value="galeria"
				groups={[
					{
						id: 'g',
						items: [
							{ id: 'ficha', label: 'Mi ficha', icon: FileText, href: '#' },
							{ id: 'galeria', label: 'Galería', icon: Images, href: '#' }
						]
					}
				]}
			/>
		{/snippet}
		{#snippet bottomNav()}
			<BottomNav
				variant="default"
				items={[
					{ id: 'inicio', label: 'Inicio', iconComponent: House, href: '#' },
					{ id: 'escaparate', label: 'Escaparate', iconComponent: Store, href: '#' },
					{ id: 'crear', label: 'Crear', iconComponent: Plus, primary: true },
					{ id: 'clientes', label: 'Clientes', iconComponent: Users, href: '#', badge: 9 },
					{ id: 'mas', label: 'Más', iconComponent: Menu, href: '#' }
				]}
				value={section}
			/>
		{/snippet}
		<p class="text-sm text-muted">Contenido de la sección</p>
	</WorkspaceShell>
</div>
