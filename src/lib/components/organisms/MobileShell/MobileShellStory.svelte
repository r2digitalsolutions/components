<script lang="ts">
	import MobileShell from './MobileShell.svelte';
	import PhoneFrame from '$lib/components/molecules/PhoneFrame/PhoneFrame.svelte';
	import Stories from '$lib/components/molecules/Stories/Stories.svelte';
	import ChipBar from '$lib/components/molecules/ChipBar/ChipBar.svelte';

	let tab = $state('home');
	let filter = $state('all');
</script>

<PhoneFrame>
	<MobileShell bind:activeNav={tab} title="Explore" subtitle="Near you" class="min-h-full">
		<div class="space-y-4">
			<Stories
				items={[
					{ id: '1', name: 'You', seen: true },
					{ id: '2', name: 'Mia' },
					{ id: '3', name: 'Leo', live: true },
					{ id: '4', name: 'Sam' }
				]}
			/>
			<ChipBar
				bind:value={filter}
				items={[
					{ id: 'all', label: 'All' },
					{ id: 'food', label: 'Food' },
					{ id: 'cafes', label: 'Cafés' },
					{ id: 'parks', label: 'Parks' }
				]}
			/>
			{#each ['Sunrise bakery', 'Harbor walk', 'City market'] as place}
				<div class="rounded-xl border border-border bg-surface-elevated px-3 py-3 text-sm text-primary">
					{place}
				</div>
			{/each}
		</div>
	</MobileShell>
</PhoneFrame>
