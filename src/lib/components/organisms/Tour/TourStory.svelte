<script lang="ts">
	import Tour from './Tour.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let open = $state(false);
	const steps = [
		{
			id: '1',
			selector: '#tour-target-a',
			title: 'Create projects',
			content: 'Start here to create a new workspace project.',
			placement: 'bottom' as const
		},
		{
			id: '2',
			selector: '#tour-target-b',
			title: 'Invite teammates',
			content: 'Share access with your team from this button.',
			placement: 'bottom' as const
		}
	];
</script>

<div class="flex gap-3">
	<span id="tour-target-a"><Button size="sm">New project</Button></span>
	<span id="tour-target-b"><Button size="sm" variant="secondary">Invite</Button></span>
	<Button size="sm" variant="outline" onclick={() => (open = true)}>Start tour</Button>
</div>

<Tour bind:open {steps} />
