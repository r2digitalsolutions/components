<script lang="ts">
	import InviteTeamForm from './InviteTeamForm.svelte';

	interface Props {
		variant?: 'default' | 'loading' | 'success' | 'async';
	}

	let { variant = 'default' }: Props = $props();
	let last = $state('');
	let success = $state(variant === 'success');
</script>

<div class="flex flex-col items-center gap-3 p-4">
	{#if variant === 'loading'}
		<InviteTeamForm loading />
	{:else if variant === 'success'}
		<InviteTeamForm bind:success />
	{:else if variant === 'async'}
		<InviteTeamForm
			onsubmit={async (p) => {
				await new Promise((r) => setTimeout(r, 800));
				last = `${p.emails.length} · ${p.role}`;
			}}
		/>
	{:else}
		<InviteTeamForm
			onsubmit={(p) => {
				last = `${p.emails.join(', ')} · ${p.role}`;
			}}
		/>
	{/if}

	{#if last}
		<p class="text-center text-xs text-muted">Submitted: {last}</p>
	{/if}
</div>
