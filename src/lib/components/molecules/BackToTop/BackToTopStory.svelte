<script lang="ts">
	import BackToTop from './BackToTop.svelte';

	let props = $props<{
		threshold?: number;
		position?: 'bottom-right' | 'bottom-left';
	}>();

	let scrollEl = $state<HTMLDivElement | null>(null);
</script>

<div class="w-full max-w-md space-y-3">
	<p class="text-sm text-secondary">
		Haz scroll en el panel de abajo. El botón aparece al pasar el umbral.
	</p>

	<div class="relative h-72 overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-sm">
		<div bind:this={scrollEl} class="h-full overflow-y-auto p-4 text-sm text-secondary">
			{#each Array.from({ length: 40 }, (_, i) => i + 1) as n (n)}
				<p class="mb-2 leading-relaxed">
					Línea {n} — sigue bajando para revelar el botón flotante.
				</p>
			{/each}
		</div>

		{#if scrollEl}
			<BackToTop
				target={scrollEl}
				threshold={props.threshold ?? 80}
				position={props.position ?? 'bottom-right'}
				mode="absolute"
			/>
		{/if}
	</div>
</div>
