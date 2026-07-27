<script lang="ts">
	import MobileAccountPage from './MobileAccountPage.svelte';
	import PhoneFrame from '$lib/components/molecules/PhoneFrame/PhoneFrame.svelte';
	import type { QuickAction } from '$lib/components/molecules/QuickActionGrid/QuickActionGrid.svelte';

	const actions: QuickAction[] = [
		{ id: 'invite', label: 'Invite', description: 'Add teammates', icon: 'plus' },
		{ id: 'upload', label: 'Upload', description: 'Share files', icon: 'upload' },
		{ id: 'share', label: 'Share', description: 'Send a link', icon: 'share' }
	];

	let last = $state('');
</script>

<div class="flex justify-center py-8">
	<PhoneFrame size="md">
		<div class="overflow-y-auto p-4">
			<MobileAccountPage
				name="Ada Lovelace"
				email="ada@example.com"
				{actions}
				version="2.4.1"
				onaction={(id) => (last = id)}
				onsignout={() => (last = 'sign-out')}
			/>
		</div>
	</PhoneFrame>
</div>

{#if last}
	<p class="text-center text-xs text-muted">Action: {last}</p>
{/if}
