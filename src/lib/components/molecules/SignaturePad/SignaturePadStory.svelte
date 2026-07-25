<script lang="ts">
	import SignaturePad from './SignaturePad.svelte';

	let {
		height = 200,
		disabled = false,
		penColor = 'ink',
		variant = 'default'
	}: {
		height?: number;
		disabled?: boolean;
		penColor?: 'ink' | 'brand' | 'blue';
		variant?: 'default' | 'compact' | 'preview';
	} = $props();

	let value = $state('');
</script>

<div class="flex w-full max-w-lg flex-col gap-4">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Signature pad</p>
		<p class="text-xs leading-relaxed text-secondary">
			Card shell with guide line, undo/clear, and PNG export via <code class="text-primary">bind:value</code>.
		</p>
	</div>

	<SignaturePad
		bind:value
		{height}
		{disabled}
		{penColor}
		label={variant === 'compact' ? 'Initials' : 'Signature'}
		description={variant === 'compact'
			? 'Sign with your initials'
			: 'Draw your signature in the box below'}
		class="w-full"
	/>

	{#if variant === 'preview' && value}
		<div class="overflow-hidden rounded-2xl border border-border bg-surface-elevated p-3">
			<p class="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted">Exported PNG</p>
			<img src={value} alt="Signature preview" class="max-h-28 w-full object-contain" />
			<p class="mt-2 text-[11px] text-muted">{Math.round(value.length / 1024)} KB data URL</p>
		</div>
	{:else if value}
		<p class="text-xs text-muted">Captured · {Math.round(value.length / 1024)} KB</p>
	{/if}
</div>
