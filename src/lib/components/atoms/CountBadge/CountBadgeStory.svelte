<script lang="ts">
	import CountBadge from './CountBadge.svelte';

	let props = $props<{
		count?: number;
		hideZero?: boolean;
		max?: number;
		variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
	}>();
</script>

<div class="flex items-center gap-4">
	<span class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-elevated text-secondary">
		<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
			/>
		</svg>
		<span class="absolute -right-1.5 -top-1.5">
			<CountBadge
				count={props.count ?? 3}
				hideZero={props.hideZero ?? true}
				max={props.max ?? 99}
				variant={props.variant ?? 'error'}
			/>
		</span>
	</span>
	<CountBadge count={props.count ?? 3} variant={props.variant ?? 'primary'} />
	<CountBadge count={120} max={99} variant="error" />
</div>
