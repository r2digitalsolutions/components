<script lang="ts">
	import Resizable from './Resizable.svelte';

	let props = $props<{
		orientation?: 'horizontal' | 'vertical';
		defaultSize?: number;
		minSize?: number;
		maxSize?: number;
	}>();
</script>

<div class="w-full max-w-2xl p-6 flex flex-col gap-8">
	<div>
		<p class="text-xs text-secondary mb-2 font-medium">Horizontal split</p>
		<Resizable
			orientation={props.orientation ?? 'horizontal'}
			defaultSize={props.defaultSize ?? 50}
			minSize={props.minSize ?? 20}
			maxSize={props.maxSize ?? 80}
			class="h-48 rounded-lg border border-border overflow-hidden"
		>
			{#snippet start()}
				<div class="h-full bg-surface-elevated p-4 flex items-start justify-start">
					<p class="text-sm text-secondary font-medium">Left Pane</p>
				</div>
			{/snippet}
			{#snippet end()}
				<div class="h-full bg-surface-overlay p-4 flex items-start justify-start">
					<p class="text-sm text-secondary font-medium">Right Pane</p>
				</div>
			{/snippet}
		</Resizable>
	</div>

	<div>
		<p class="text-xs text-secondary mb-2 font-medium">Vertical split</p>
		<Resizable
			orientation="vertical"
			defaultSize={40}
			class="h-64 rounded-lg border border-border overflow-hidden"
		>
			{#snippet start()}
				<div class="w-full h-full bg-surface-elevated p-4 flex items-start">
					<p class="text-sm text-secondary font-medium">Top Pane</p>
				</div>
			{/snippet}
			{#snippet end()}
				<div class="w-full h-full bg-surface-overlay p-4 flex items-start">
					<p class="text-sm text-secondary font-medium">Bottom Pane</p>
				</div>
			{/snippet}
		</Resizable>
	</div>
</div>
