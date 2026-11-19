<script lang="ts">
	import EntityHero from './EntityHero.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
</script>

<div class="max-w-5xl p-6">
	<EntityHero
		title="Bar La Plaza"
		coverSize="md"
		subtitle="Tapas, raciones y terraza · Calle Mayor 12, Madrid"
		stats={[
			{ label: 'Visitas', value: '1.284' },
			{ label: 'Solicitudes', value: 6 },
			{ label: 'Reservas', value: 14 },
			{ label: 'Valoración', value: '4,8 ★' }
		]}
	>
		{#snippet coverActions()}<Button size="sm" variant="secondary">Cambiar portada</Button><Button
				size="sm"
				variant="secondary">Ajustar encuadre</Button
			>{/snippet}
		{#snippet badges()}<Badge variant="success" dot>Publicada</Badge><Badge variant="warning"
				>Verificación pendiente</Badge
			>{/snippet}
		{#snippet actions()}<Button variant="outline" size="sm">Mi QR</Button>{/snippet}
	</EntityHero>
</div>
