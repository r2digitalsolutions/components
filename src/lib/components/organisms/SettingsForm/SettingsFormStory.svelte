<script lang="ts">
	import SettingsForm from './SettingsForm.svelte';
	import DangerZone from '$lib/components/molecules/DangerZone/DangerZone.svelte';

	interface Props {
		saving?: boolean;
	}

	let { saving = false }: Props = $props();

	let dirty = $state(false);
	let savedHint = $state('');
	let savingState = $state(false);

	const busy = $derived(saving || savingState);
</script>

<div class="mx-auto max-w-3xl p-4 sm:p-6 pb-28">
	<SettingsForm
		bind:dirty
		saving={busy}
		{savedHint}
		values={{
			name: 'Rafael Gonzalez',
			username: 'rafael',
			email: 'rafael@r2digisolutions.com',
			bio: 'Design engineer building Svelte component systems.',
			avatar: 'https://i.pravatar.cc/160?img=12',
			language: 'es',
			timezone: 'Europe/Madrid',
			theme: 'system',
			newsletter: true,
			mentions: true,
			digest: false,
			marketing: false,
			profilePublic: true,
			showEmail: false
		}}
		onsave={async () => {
			savingState = true;
			savedHint = '';
			await new Promise((r) => setTimeout(r, 700));
			savingState = false;
			savedHint = 'Saved just now';
		}}
		onavatar={() => {
			savedHint = 'Avatar picker would open';
		}}
	>
		{#snippet footer()}
			<DangerZone
				title="Delete account"
				description="Permanently remove your account and all associated data. This cannot be undone."
				actionLabel="Delete account"
			/>
		{/snippet}
	</SettingsForm>
</div>
