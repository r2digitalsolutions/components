<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	let props = $props<{
		value?: number;
		max?: number;
		indeterminate?: boolean;
		variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
		size?: 'sm' | 'md' | 'lg';
		showValue?: boolean;
		label?: string;
	}>();
</script>

<div class="w-80 max-w-full">
	<ProgressBar
		value={props.value ?? 60}
		max={props.max ?? 100}
		indeterminate={props.indeterminate ?? false}
		variant={props.variant ?? 'primary'}
		size={props.size ?? 'md'}
		showValue={props.showValue ?? true}
		label={props.label ?? 'Uploading file...'}
	/>
</div>
