<script lang="ts">
	import HoverCard from './HoverCard.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';

	let props = $props<{
		placement?: 'top' | 'bottom' | 'left' | 'right';
	}>();
</script>

<div class="flex min-h-40 items-center justify-center">
	<HoverCard placement={props.placement ?? 'bottom'}>
		{#snippet trigger()}
			<button type="button" class="text-sm font-medium text-brand-600 underline-offset-2 hover:underline">
				@rafa
			</button>
		{/snippet}
		<div class="flex gap-3">
			<Avatar name="Rafa Gonzalez" size="md" status="online" />
			<div>
				<p class="text-sm font-medium text-primary">Rafa Gonzalez</p>
				<p class="text-xs text-secondary">Product engineer · Madrid</p>
			</div>
		</div>
	</HoverCard>
</div>
