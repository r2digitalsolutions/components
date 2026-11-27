<script lang="ts">
	import CopyButton from '$lib/components/molecules/CopyButton/CopyButton.svelte';

	interface CopyFieldProps {
		value: string;
		label?: string;
		masked?: boolean;
		/** Texto del botón (por defecto, «Copy» traducido con `i18n`). */
		copyLabel?: string;
		/** Texto tras copiar (por defecto, «Copied» traducido con `i18n`). */
		copiedLabel?: string;
		/** `sm`: compacto, botón fantasma. `md`: alto de un input, con botón de acción a la derecha. */
		size?: 'sm' | 'md';
		/** Variante del botón de copiar (por defecto `ghost` en `sm` y `primary` en `md`). */
		copyVariant?: 'primary' | 'secondary' | 'ghost' | 'outline';
		class?: string;
		oncopy?: () => void;
	}

	const {
		value,
		label,
		masked = false,
		copyLabel,
		copiedLabel,
		size = 'sm',
		copyVariant,
		class: className = '',
		oncopy
	}: CopyFieldProps = $props();

	const display = $derived(
		masked ? value.replace(/.(?=.{4})/g, '•') : value
	);
</script>

<div class={['w-full', className]}>
	{#if label}
		<p class="mb-1.5 text-xs font-medium text-secondary">{label}</p>
	{/if}
	{#if size === 'md'}
		<div
			class="flex h-10 items-center gap-2 rounded-lg border border-border bg-surface-overlay/50 pl-3 pr-1"
		>
			<code class="min-w-0 flex-1 truncate font-mono text-sm text-primary" title={value}>
				{display}
			</code>
			<CopyButton
				{value}
				size="sm"
				variant={copyVariant ?? 'primary'}
				label={copyLabel}
				{copiedLabel}
				class="shrink-0"
				{oncopy}
			/>
		</div>
	{:else}
		<div
			class="flex items-center gap-2 rounded-lg border border-border bg-surface-overlay/50 px-2.5 py-1.5"
		>
			<code class="min-w-0 flex-1 truncate font-mono text-xs text-primary" title={value}>
				{display}
			</code>
			<CopyButton
				{value}
				size="xs"
				variant={copyVariant ?? 'ghost'}
				label={copyLabel}
				{copiedLabel}
				{oncopy}
			/>
		</div>
	{/if}
</div>
