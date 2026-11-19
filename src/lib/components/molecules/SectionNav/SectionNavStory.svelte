<script lang="ts">
	import SectionNav, { type SectionNavGroup } from './SectionNav.svelte';
	import OrgSwitcher from '$lib/components/molecules/OrgSwitcher/OrgSwitcher.svelte';
	import { FileText, Images, Wrench, QrCode, Tag, ExternalLink } from '@lucide/svelte';

	const groups: SectionNavGroup[] = [
		{
			id: 'main',
			items: [
				{
					id: 'ficha',
					label: 'Mi ficha',
					icon: FileText,
					badge: '80%',
					badgeTone: 'neutral',
					href: '#'
				},
				{ id: 'galeria', label: 'Galería', icon: Images, href: '#' },
				{ id: 'servicios', label: 'Servicios', icon: Wrench, href: '#' },
				{ id: 'precios', label: 'Precios y QR', icon: QrCode, href: '#' },
				{ id: 'ofertas', label: 'Ofertas', icon: Tag, badge: 1, badgeTone: 'neutral', href: '#' }
			]
		}
	];
	let value = $state('galeria');
</script>

<div class="rounded-xl border-border h-[34rem] overflow-hidden border">
	<SectionNav title="Escaparate" description="Lo que ven tus clientes" {groups} bind:value>
		{#snippet header()}
			<OrgSwitcher
				orgs={[
					{ id: 'bl', name: 'Bar La Plaza', subtitle: '3 empresas', tone: 'brand' },
					{ id: 'rp', name: 'Reformas Plaza', subtitle: 'Propietario', tone: 'amber', badge: 2 }
				]}
				value="bl"
				title="Tus empresas"
				createLabel="Crear o vincular empresa"
				oncreate={() => {}}
			/>
		{/snippet}
		{#snippet footer()}
			<a href="#top" class="gap-2 px-3 py-2 text-sm font-medium text-brand-700 flex items-center"
				><ExternalLink size={16} />Ver ficha pública</a
			>
		{/snippet}
	</SectionNav>
</div>
