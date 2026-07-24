<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	let props = $props<{
		variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
		width?: string;
		height?: string;
		animation?: 'pulse' | 'shimmer' | 'none';
	}>();
</script>

<div class="w-80 max-w-full flex flex-col gap-3">
	{#if props.variant === 'circular'}
		<div class="flex items-center gap-3">
			<Skeleton variant="circular" width="48px" height="48px" animation={props.animation ?? 'pulse'} />
			<div class="flex-1 flex flex-col gap-2">
				<Skeleton variant="text" width="60%" animation={props.animation ?? 'pulse'} />
				<Skeleton variant="text" width="40%" animation={props.animation ?? 'pulse'} />
			</div>
		</div>
	{:else}
		<Skeleton
			variant={props.variant ?? 'rounded'}
			width={props.width}
			height={props.height}
			animation={props.animation ?? 'pulse'}
		/>
	{/if}
</div>
