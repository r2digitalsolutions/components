<script lang="ts">
	import CopyField from './CopyField.svelte';
</script>

<div class="max-w-md space-y-3">
	<CopyField label="API key" value="sk_live_4f8a2c91e0b7d3" masked />
	<CopyField label="Webhook URL" value="https://api.example.com/hooks/abc" />
	<CopyField
		label="Enlace secreto (size md)"
		value="https://evoclap.com/@empresa?vista=jAR7Kke0g7fHx6Wed"
		size="md"
		copyLabel="Copiar enlace"
		copiedLabel="Copiado"
	/>
</div>
