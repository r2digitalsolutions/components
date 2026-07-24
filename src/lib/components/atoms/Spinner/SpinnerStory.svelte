<script lang="ts">
	import Spinner from './Spinner.svelte';

	let props = $props<{
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		variant?: 'primary' | 'secondary' | 'white' | 'current';
		label?: string;
	}>();
</script>

<div class={props.variant === 'white' ? 'bg-brand-500 rounded-lg p-4 inline-flex' : 'inline-flex'}>
	<Spinner
		size={props.size ?? 'md'}
		variant={props.variant ?? 'primary'}
		label={props.label ?? 'Loading...'}
	/>
</div>
