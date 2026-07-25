<script lang="ts">
	import Tour from './Tour.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let open = $state(true);
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
		},
		{
			id: '3',
			selector: '#tour-target-c',
			title: 'Settings',
			content: 'Configure workspace preferences any time.',
			placement: 'left' as const
		}
	];
</script>

<div class="flex min-h-[22rem] w-[36rem] max-w-full flex-col justify-between rounded-2xl border border-border bg-surface p-8">
	<div class="flex items-center justify-between gap-3">
		<div class="flex gap-3">
			<span id="tour-target-a"><Button size="sm">New project</Button></span>
			<span id="tour-target-b"><Button size="sm" variant="secondary">Invite</Button></span>
		</div>
		<span id="tour-target-c"><Button size="sm" variant="outline">Settings</Button></span>
	</div>

	<div class="flex justify-center">
		<Button size="sm" variant="outline" onclick={() => (open = true)}>Start tour</Button>
	</div>
</div>

<Tour bind:open {steps} />
