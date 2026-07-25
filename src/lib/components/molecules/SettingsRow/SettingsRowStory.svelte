<script lang="ts">
	import SettingsRow from './SettingsRow.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	let email = $state(true);
	let marketing = $state(false);
	let security = $state(true);
</script>

<div class="max-w-lg">
	<Stack gap="sm">
		<SettingsRow
			title="Email notifications"
			description="Get notified about mentions and comments."
			bind:checked={email}
		/>
		<SettingsRow
			title="Marketing emails"
			description="Occasional product updates and tips."
			bind:checked={marketing}
		/>
		<SettingsRow
			title="Two-factor authentication"
			description="Require a second factor at sign-in."
			bind:checked={security}
			hint="Recommended for admin accounts"
		/>
	</Stack>
</div>
