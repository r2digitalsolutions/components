<script lang="ts">
	import Divider from './Divider.svelte';

	let props = $props<{
		orientation?: 'horizontal' | 'vertical';
		label?: string;
	}>();
</script>

<div class="w-72 max-w-full space-y-4">
	<p class="text-sm text-primary">Above</p>
	<Divider orientation={props.orientation ?? 'horizontal'} label={props.label} />
	<p class="text-sm text-primary">Below</p>
</div>
