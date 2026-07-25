<script lang="ts">
	import Meter from './Meter.svelte';

	let props = $props<{
		value?: number;
		tone?: 'default' | 'success' | 'warning' | 'error' | 'brand';
		size?: 'sm' | 'md' | 'lg';
	}>();
</script>

<div class="w-full max-w-md space-y-4">
	<Meter
		value={props.value ?? 72}
		tone={props.tone ?? 'brand'}
		size={props.size ?? 'md'}
		label="Storage used"
	/>
	<Meter value={40} tone="warning" label="CPU" size="sm" />
	<Meter value={92} tone="error" label="Memory" />
</div>
