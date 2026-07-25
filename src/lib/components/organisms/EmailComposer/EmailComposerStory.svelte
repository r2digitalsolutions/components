<script lang="ts">
	import EmailComposer from './EmailComposer.svelte';

	let to = $state(['team@acme.com']);
	let subject = $state('Weekly update');
	let last = $state('');
</script>

<div class="flex justify-center p-4">
	<EmailComposer
		bind:to
		bind:subject
		onsend={(p) => (last = `${p.to.join(', ')} · ${p.subject}`)}
	/>
</div>
{#if last}
	<p class="text-center text-xs text-muted">Sent: {last}</p>
{/if}
