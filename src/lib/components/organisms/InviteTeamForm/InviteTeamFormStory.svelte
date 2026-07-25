<script lang="ts">
	import InviteTeamForm from './InviteTeamForm.svelte';

	let last = $state('');
</script>

<div class="flex justify-center p-4">
	<InviteTeamForm onsubmit={(p) => (last = `${p.emails.length} invites · ${p.role}`)} />
</div>
{#if last}
	<p class="text-center text-xs text-muted">{last}</p>
{/if}
