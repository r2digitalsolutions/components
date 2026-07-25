<script lang="ts">
	import Wizard from './Wizard.svelte';

	const steps = [
		{ id: 'account', label: 'Account', description: 'Basic info' },
		{ id: 'profile', label: 'Profile', description: 'Details' },
		{ id: 'done', label: 'Done', description: 'Confirm' }
	];

	let current = $state(0);
	const panels = [
		'Enter your email and create a password.',
		'Add a display name and avatar.',
		'Review and finish setup.'
	];
</script>

<Wizard bind:current {steps} class="w-full max-w-xl">
	{#snippet children(index)}
		<p class="rounded-xl border border-border bg-surface-elevated p-4 text-sm text-secondary">
			{panels[index]}
		</p>
	{/snippet}
</Wizard>
