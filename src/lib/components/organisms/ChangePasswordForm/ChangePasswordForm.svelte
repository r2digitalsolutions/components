<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import PasswordField from '$lib/components/molecules/PasswordField/PasswordField.svelte';
	import PasswordInput from '$lib/components/molecules/PasswordInput/PasswordInput.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import FieldHint from '$lib/components/atoms/FieldHint/FieldHint.svelte';

	interface ChangePasswordFormProps {
		title?: string;
		subtitle?: string;
		loading?: boolean;
		class?: string;
		onsubmit?: (payload: {
			currentPassword: string;
			newPassword: string;
			confirmPassword: string;
		}) => void;
	}

	let {
		title = 'Change password',
		subtitle = 'Choose a strong password you have not used elsewhere.',
		loading = false,
		class: className = '',
		onsubmit
	}: ChangePasswordFormProps = $props();

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	const mismatch = $derived(
		confirmPassword.length > 0 && newPassword !== confirmPassword
	);

	function submit() {
		if (mismatch) return;
		onsubmit?.({ currentPassword, newPassword, confirmPassword });
	}
</script>

<Card class={`w-full max-w-md ${className}`} padding="lg" chrome={false}>
	<div class="mb-5 space-y-1">
		<Heading level={2} size="xl">{title}</Heading>
		<p class="text-sm text-muted">{subtitle}</p>
	</div>

	<form
		class="space-y-4"
		onsubmit={(e) => {
			e.preventDefault();
			submit();
		}}
	>
		<PasswordInput bind:value={currentPassword} label="Current password" required />
		<PasswordField bind:value={newPassword} label="New password" required />
		<div class="space-y-1.5">
			<PasswordInput bind:value={confirmPassword} label="Confirm new password" required />
			{#if mismatch}
				<FieldHint text="Passwords do not match." tone="error" />
			{/if}
		</div>

		{#if newPassword.length > 0 && newPassword.length < 8}
			<Alert variant="warning" title="Almost there" message="Use at least 8 characters." />
		{/if}

		<FormActions
			submitLabel="Update password"
			showCancel={false}
			{loading}
			disabled={mismatch || !currentPassword || !newPassword}
			align="end"
			onsubmit={submit}
		/>
	</form>
</Card>
