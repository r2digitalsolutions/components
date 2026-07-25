<script lang="ts">
	import Spacer from './Spacer.svelte';

	let props = $props<{ size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'; axis?: 'y' | 'x' | 'both' }>();
</script>

<div class="rounded-xl border border-border bg-surface-elevated p-4">
	<p class="text-sm text-primary">Above</p>
	<Spacer size={props.size ?? 'md'} axis={props.axis ?? 'y'} />
	<p class="text-sm text-primary">Below</p>
</div>
