<script lang="ts">
	import VisuallyHidden from './VisuallyHidden.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	let reveal = $state(false);
</script>

<div class="w-full max-w-lg space-y-5 rounded-2xl border border-border bg-surface-elevated p-5">
	<div class="space-y-1">
		<h3 class="text-sm font-semibold text-primary">¿Qué es VisuallyHidden?</h3>
		<p class="text-sm text-muted leading-relaxed">
			Oculta texto <strong class="font-medium text-secondary">visualmente</strong>, pero lo
			mantiene en el DOM para lectores de pantalla (VoiceOver, NVDA, etc.). Útil en botones
			solo-icono o imágenes decorativas que necesitan un nombre accesible.
		</p>
	</div>

	<div class="flex flex-wrap items-center gap-3">
		<!-- Solo icono a la vista; lectores de pantalla oyen "Notifications" -->
		<Button size="sm" variant="secondary">
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
				/>
			</svg>
			<VisuallyHidden>Notifications</VisuallyHidden>
		</Button>

		<IconButton label="Search" size="sm" variant="ghost">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
				/>
			</svg>
		</IconButton>
		<span class="text-xs text-muted">← IconButton ya usa aria-label; VisuallyHidden es la alternativa con texto en el DOM</span>
	</div>

	<label class="flex cursor-pointer items-center gap-2 text-sm text-secondary">
		<input type="checkbox" bind:checked={reveal} class="rounded border-border" />
		Mostrar el texto oculto (solo para demo)
	</label>

	{#if reveal}
		<div class="rounded-xl border border-dashed border-border bg-surface-overlay px-3 py-2 text-sm text-primary">
			Texto que “ve” el lector de pantalla:
			<code class="ml-1 rounded bg-surface-elevated px-1.5 py-0.5 text-xs">Notifications</code>
		</div>
	{/if}

	<pre
		class="overflow-x-auto rounded-xl border border-border bg-surface-overlay p-3 text-xs text-secondary"
	><code>{`<Button>
  <BellIcon aria-hidden="true" />
  <VisuallyHidden>Notifications</VisuallyHidden>
</Button>`}</code></pre>
</div>
