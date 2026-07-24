<script lang="ts">
	import AspectRatio from './AspectRatio.svelte';

	let props = $props<{ ratio?: number }>();

	const ratio = $derived(props.ratio ?? 1.777777778);
	const label = $derived(props.ratio != null ? props.ratio.toFixed(2) : '16x9');
</script>

<div class="w-80 max-w-full">
	<AspectRatio {ratio} class="rounded-xl border border-border bg-surface-overlay">
		<div class="flex h-full items-center justify-center text-sm text-secondary">
			{label} media
		</div>
	</AspectRatio>
</div>
