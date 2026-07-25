<script lang="ts">
	import SettingsPage from './SettingsPage.svelte';

	let props = $props<{
		example?: 'default' | 'security' | 'danger' | 'loading' | 'flat';
		loading?: boolean;
	}>();

	const example = $derived(props.example ?? 'default');
	const initialSection = $derived(
		example === 'security' ? 'security' : example === 'danger' ? 'danger' : 'general'
	);

	let value = $state('general');
	let dirty = $state(false);
	let lastSaved = $state('');

	$effect(() => {
		value = initialSection;
		dirty = false;
	});
</script>

<div class="mx-auto w-full max-w-4xl p-4">
	{#key example}
		{#if example === 'flat'}
			<SettingsPage
				bind:value
				bind:dirty
				loading={props.loading ?? false}
				groups={[]}
				items={[
					{ id: 'general', label: 'General', description: 'Workspace defaults' },
					{ id: 'appearance', label: 'Appearance', description: 'Theme and density' },
					{ id: 'notifications', label: 'Notifications', description: 'Email and in-app' },
					{ id: 'security', label: 'Security', description: 'Access and sessions' },
					{ id: 'danger', label: 'Danger zone', description: 'Irreversible actions' }
				]}
				onsubmit={(v) => (lastSaved = v.workspaceName)}
				ondelete={() => (lastSaved = 'deleted')}
				onpassword={() => (lastSaved = 'password')}
				onsessions={() => (lastSaved = 'sessions')}
			/>
		{:else}
			<SettingsPage
				bind:value
				bind:dirty
				loading={props.loading ?? example === 'loading'}
				onsubmit={(v) => (lastSaved = v.workspaceName)}
				ondelete={() => (lastSaved = 'deleted')}
				onpassword={() => (lastSaved = 'password')}
				onsessions={() => (lastSaved = 'sessions')}
			/>
		{/if}
	{/key}
</div>

{#if lastSaved}
	<p class="pb-4 text-center text-xs text-muted">Last action: {lastSaved}</p>
{/if}
