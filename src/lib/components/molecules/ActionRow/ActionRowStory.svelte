<script lang="ts">
	import ActionRow from './ActionRow.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import { Inbox, CalendarCheck, Star } from '@lucide/svelte';
</script>

<div class="max-w-2xl rounded-2xl border-border bg-surface-elevated px-5 py-2 border">
	<ActionRow
		first
		unread
		title="María G."
		meta="hace 12 min"
		description="Presupuesto: comida de empresa, 25 personas"
		icon={Inbox}
		tone="info"
	>
		{#snippet actions()}<Button size="sm">Responder</Button>{/snippet}
	</ActionRow>
	<ActionRow
		title="Javier L."
		meta="hace 1 h"
		description="Reserva terraza · sáb. 21:30 · 6 personas"
		icon={CalendarCheck}
	>
		{#snippet actions()}<Button size="sm" variant="outline">Rechazar</Button><Button size="sm"
				>Aceptar</Button
			>{/snippet}
	</ActionRow>
	<ActionRow
		title="Ana R."
		meta="ayer"
		description="“Las croquetas de puchero, de lo mejor de Madrid.”"
		icon={Star}
		tone="warning"
	/>
</div>
