<script lang="ts">
	import Surface from './Surface.svelte';

	let props = $props<{
		variant?: 'default' | 'elevated' | 'overlay' | 'soft' | 'ghost';
		padding?: 'none' | 'sm' | 'md' | 'lg';
	}>();
</script>

<Surface variant={props.variant ?? 'elevated'} padding={props.padding ?? 'md'} class="max-w-sm">
	<p class="text-sm font-medium text-primary">Surface panel</p>
	<p class="mt-1 text-xs text-muted">Reusable background container for composition.</p>
</Surface>
