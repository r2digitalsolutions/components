<script lang="ts">
	import OrgSwitcher, { type OrgItem } from './OrgSwitcher.svelte';

	let value = $state('acme');
	let many = $state('evoteg');
	let last = $state('');

	const names = [
		'Evoteg',
		'EvoFact',
		'Evomercado Marketplace',
		'Evoclap',
		'EvoTrain',
		'Reformas Alba',
		'Panadería Sol',
		'Clínica Dental Ñandú',
		'Taller Mecánico Ruiz',
		'Peluquería Bella',
		'Inmobiliaria Costa',
		'Gimnasio Fuerza'
	];
	const tones = ['brand', 'sky', 'emerald', 'amber', 'rose'] as const;
	const statuses = [
		{ label: 'Pública', tone: 'success' },
		{ label: 'Oculta', tone: 'warning' },
		{ label: 'Privada', tone: 'neutral' }
	] as const;
	const manyOrgs: OrgItem[] = names.map((name, i) => ({
		id: name.toLowerCase().split(' ')[0],
		name,
		subtitle: i % 4 === 3 ? 'Administrador' : 'Propietario',
		status: { ...statuses[i % 3] },
		plan: i < 5 ? 'Pro' : undefined,
		verified: i < 5,
		badge: i === 6 ? 3 : undefined,
		tone: tones[i % tones.length]
	}));
</script>

<div class="max-w-sm gap-6 p-4 mx-auto grid">
	<OrgSwitcher
		bind:value
		oncreate={() => (last = 'create')}
		onchange={(id) => (last = `switch:${id}`)}
	/>
	<OrgSwitcher bind:value compact />
	<div class="w-60">
		<OrgSwitcher
			bind:value={many}
			orgs={manyOrgs}
			title="Tus empresas"
			createLabel="Añadir otra empresa"
			footerNote="Ligadas a tu cuenta Evoteg"
			searchPlaceholder="Buscar empresa…"
			emptyLabel="Ninguna empresa coincide"
			verifiedLabel="Verificada"
			oncreate={() => (last = 'create')}
			onchange={(id) => (last = `switch:${id}`)}
		/>
	</div>
	{#if last}
		<p class="text-xs text-muted text-center">Action: {last}</p>
	{/if}
</div>
