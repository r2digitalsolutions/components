<script lang="ts">
	import AdUnit from './AdUnit.svelte'
	import type { AdUnitFormat } from './AdUnit.svelte'

	interface Props {
		format?: AdUnitFormat
	}

	let { format = 'native' }: Props = $props()

	const demoImage = 'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=600&q=80'
</script>

<div class="mx-auto w-full max-w-xl space-y-4 p-4">
	<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Formato: {format}</p>

	<AdUnit
		{format}
		headline="EvoFact — Facturación inteligente para tu empresa"
		description="Emite facturas electrónicas con VeriFactu, gestiona clientes y cobra más rápido. Prueba gratis 14 días."
		imageUrl={demoImage}
		href="https://evoteg.com"
		advertiser="evoteg.com"
	/>

	{#if format === 'native'}
		<AdUnit
			{format}
			headline="Atom — Software para gimnasios"
			description="Gestiona socios, accesos y clases con la plataforma líder en centros deportivos."
			href="https://atom.com"
			advertiser="atom.com"
			label="Patrocinado"
		/>
	{/if}
</div>
