<script lang="ts">
	import Popover from './Popover.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		placement?: 'top' | 'bottom' | 'left' | 'right';
	}>();

	let open = $state(false);
</script>

<div class="flex min-h-40 items-center justify-center">
	<Popover bind:open placement={props.placement ?? 'bottom'}>
		{#snippet trigger()}
			<Button size="sm" variant="secondary" onclick={() => (open = !open)}>
				Open popover
			</Button>
		{/snippet}
		<div class="space-y-1">
			<p class="text-sm font-medium text-primary">Quick actions</p>
			<p class="text-xs text-secondary">Share, duplicate, or archive this item.</p>
		</div>
	</Popover>
</div>
