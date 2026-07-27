<script lang="ts">
	import Inset from './Inset.svelte';
	import type { InsetPadding, InsetRounded } from './Inset.svelte';

	let props = $props<{
		padding?: InsetPadding;
		rounded?: InsetRounded;
	}>();
</script>

<Inset padding={props.padding ?? 'md'} rounded={props.rounded ?? 'lg'} class="max-w-sm">
	<p class="text-sm font-medium text-primary">Inset panel</p>
	<p class="mt-1 text-xs text-muted">Recessed surface for nested content or form sections.</p>
</Inset>
