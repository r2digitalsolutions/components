<script lang="ts">
	import CircularProgress from './CircularProgress.svelte';

	let props = $props<{
		value?: number;
		max?: number;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		indeterminate?: boolean;
		variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
		showValue?: boolean;
		label?: string;
	}>();
</script>

<div class="flex flex-wrap items-center gap-8 p-8">
	<CircularProgress
		value={props.value ?? 65}
		max={props.max ?? 100}
		size={props.size ?? 'md'}
		indeterminate={props.indeterminate ?? false}
		variant={props.variant ?? 'primary'}
		showValue={props.showValue ?? true}
		label={props.label}
	/>

	<!-- Size showcase -->
	<div class="flex items-end gap-6">
		{#each ['sm', 'md', 'lg', 'xl'] as s}
			<CircularProgress value={65} size={s as 'sm' | 'md' | 'lg' | 'xl'} showValue={s !== 'sm'} label={s} />
		{/each}
	</div>

	<!-- Variant showcase -->
	<div class="flex items-center gap-4">
		{#each ['primary', 'success', 'warning', 'error', 'info'] as v}
			<CircularProgress value={75} variant={v as 'primary' | 'success' | 'warning' | 'error' | 'info'} showValue label={v} />
		{/each}
	</div>
</div>
