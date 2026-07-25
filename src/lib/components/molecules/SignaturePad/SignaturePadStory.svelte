<script lang="ts">
	import SignaturePad from './SignaturePad.svelte';

	let value = $state('');
</script>

<SignaturePad bind:value class="w-full max-w-md" />
{#if value}
	<p class="mt-2 text-xs text-muted">Signature captured ({Math.round(value.length / 1024)} KB)</p>
{/if}
