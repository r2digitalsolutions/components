<script lang="ts">
	import PanZoomViewport from './PanZoomViewport.svelte';
</script>

<PanZoomViewport height="420px">
	<div class="flex min-w-max flex-col items-center gap-8 p-12">
		<div class="rounded-xl border border-border bg-surface-elevated px-6 py-4 text-sm font-semibold">
			Arrastra para mover · rueda para zoom · doble clic para ajustar
		</div>
		<div class="flex gap-16">
			{#each Array.from({ length: 8 }) as _, i (i)}
				<div
					class="flex h-24 w-40 items-center justify-center rounded-xl border border-border bg-surface-elevated text-sm"
				>
					Bloque {i + 1}
				</div>
			{/each}
		</div>
	</div>
</PanZoomViewport>
