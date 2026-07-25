<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import TagInput from '$lib/components/molecules/TagInput/TagInput.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import StepHeader from '$lib/components/molecules/StepHeader/StepHeader.svelte';
	import AvatarGroup from '$lib/components/molecules/AvatarGroup/AvatarGroup.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface InviteTeamFormProps {
		loading?: boolean;
		class?: string;
		onsubmit?: (payload: { emails: string[]; role: string }) => void;
	}

	let {
		loading = false,
		class: className = '',
		onsubmit
	}: InviteTeamFormProps = $props();

	let emails = $state<string[]>(['maya@acme.com']);
	let role = $state('Member');
</script>

<Card class={`w-full max-w-lg ${className}`} padding="lg" chrome={false}>
	<StepHeader
		eyebrow="Team"
		title="Invite teammates"
		description="Send invites by email. People can join as soon as they accept."
	/>

	<div class="mt-5 space-y-4">
		<TagInput bind:value={emails} label="Email addresses" placeholder="Add email and press Enter" />
		<FormField label="Default role" bind:value={role} placeholder="Member" />

		<div class="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2">
			<Text size="xs" tone="muted" as="span">Already on the workspace</Text>
			<AvatarGroup
				items={[
					{ id: '1', name: 'Ada', src: 'https://i.pravatar.cc/40?img=5' },
					{ id: '2', name: 'Alan', src: 'https://i.pravatar.cc/40?img=12' },
					{ id: '3', name: 'Grace', src: 'https://i.pravatar.cc/40?img=32' }
				]}
				max={3}
				size="sm"
			/>
		</div>

		<FormActions
			submitLabel="Send invites"
			showCancel={false}
			{loading}
			align="end"
			onsubmit={() => onsubmit?.({ emails, role })}
		/>
	</div>
</Card>
