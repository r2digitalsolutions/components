<script lang="ts">
	import ApiKeysPage from './ApiKeysPage.svelte';

	interface Props {
		variant?: 'default' | 'empty' | 'revealed';
	}

	let { variant = 'default' }: Props = $props();
	let created = $state(0);
	let last = $state('');
	let revealedSecret = $state<string | null>(
		variant === 'revealed' ? 'r2_live_8k2m_x9QpL4nR7vW3yH6cZ1bF0dA' : null
	);
</script>

<div class="mx-auto max-w-4xl p-4">
	{#if variant === 'empty'}
		<ApiKeysPage
			keys={[]}
			oncreate={() => {
				created += 1;
				last = 'create';
			}}
		/>
	{:else}
		<ApiKeysPage
			bind:revealedSecret
			oncreate={() => {
				created += 1;
				revealedSecret = 'r2_live_8k2m_x9QpL4nR7vW3yH6cZ1bF0dA';
				last = 'create';
			}}
			onrevoke={(id) => (last = `revoke:${id}`)}
			onrotateall={() => (last = 'rotate-all')}
		/>
	{/if}
</div>
{#if last || created}
	<p class="text-center text-xs text-muted">
		{#if last}Action: {last}{/if}
		{#if created} · Create ×{created}{/if}
	</p>
{/if}
