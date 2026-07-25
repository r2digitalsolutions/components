<script lang="ts">
	import FloatButton from './FloatButton.svelte';

	let props = $props<{
		position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
	}>();

	let clicks = $state(0);
</script>

<div class="relative h-64 w-full overflow-hidden rounded-2xl border border-border bg-surface-overlay">
	<p class="p-4 text-sm text-muted">Floating action button demo · clicks: {clicks}</p>
	<!-- Relative wrapper for storybook; component defaults to fixed viewport -->
	<div class="absolute inset-0">
		<FloatButton
			label="Create"
			placement="absolute"
			position={props.position ?? 'bottom-right'}
			variant={props.variant ?? 'primary'}
			onclick={() => (clicks += 1)}
		/>
	</div>
</div>
