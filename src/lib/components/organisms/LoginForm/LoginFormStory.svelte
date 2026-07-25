<script lang="ts">
	import LoginForm from './LoginForm.svelte';

	let {
		loading = false,
		variant = 'card' as 'card' | 'plain'
	}: {
		loading?: boolean;
		variant?: 'card' | 'plain';
	} = $props();

	let last = $state('');
</script>

<div class="flex min-h-[28rem] w-full items-center justify-center bg-surface p-6">
	<LoginForm
		{loading}
		{variant}
		onsubmit={(p) => (last = p.email)}
	/>
</div>
{#if last}
	<p class="mt-3 text-center text-xs text-muted">Submitted as {last}</p>
{/if}
