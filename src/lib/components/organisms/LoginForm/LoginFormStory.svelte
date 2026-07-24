<script lang="ts">
	import LoginForm from './LoginForm.svelte';

	let props = $props<{ loading?: boolean }>();
	let last = $state('');
</script>

<div class="flex min-h-[28rem] w-full items-center justify-center bg-surface p-6">
	<LoginForm
		loading={props.loading ?? false}
		onsubmit={(p) => (last = p.email)}
	/>
</div>
{#if last}
	<p class="mt-3 text-center text-xs text-muted">Submitted as {last}</p>
{/if}
