<script lang="ts">
	import AdSlot from './AdSlot.svelte'
	import AdUnit from '$lib/components/molecules/AdUnit/AdUnit.svelte'
</script>

<div class="mx-auto w-full max-w-xl space-y-4 p-4">
	<p class="text-[11px] font-medium uppercase tracking-wide text-muted">With content</p>
	<AdSlot>
		<AdUnit
			format="native"
			headline="EvoFact — Facturación inteligente para tu empresa"
			description="Prueba gratis 14 días. Sin tarjeta de crédito."
			href="https://evoteg.com"
			advertiser="evoteg.com"
		/>
	</AdSlot>

	<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Empty (renders nothing)</p>
	<div class="rounded border border-dashed border-border p-3 text-xs text-muted">
		AdSlot sin children → no renderiza nada:
		<AdSlot />
	</div>
</div>
