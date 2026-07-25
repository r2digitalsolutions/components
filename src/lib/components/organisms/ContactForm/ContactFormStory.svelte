<script lang="ts">
	import ContactForm from './ContactForm.svelte';

	let last = $state('');
</script>

<div class="flex justify-center p-4">
	<ContactForm onsubmit={(p) => (last = `${p.email} · ${p.topics.join(',')}`)} />
</div>
{#if last}
	<p class="text-center text-xs text-muted">Submitted: {last}</p>
{/if}
