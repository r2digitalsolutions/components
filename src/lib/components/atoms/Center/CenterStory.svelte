<script lang="ts">
	import Center from './Center.svelte';

	let props = $props<{
		axis?: 'both' | 'x' | 'y';
		align?: 'start' | 'center' | 'end';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		maxWidth?: string;
	}>();

	const axis = $derived(props.axis ?? 'both');
	const align = $derived(props.align ?? 'center');
	const padding = $derived(props.padding ?? 'md');
</script>

<div class="w-full max-w-2xl space-y-6">
	<div>
		<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Interactive</p>
		<div
			class="relative h-56 overflow-hidden rounded-2xl border border-border"
			style="background-image: radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--border) 80%, transparent) 1px, transparent 0); background-size: 16px 16px;"
		>
			<div
				class="pointer-events-none absolute inset-0 flex items-center justify-center"
				aria-hidden="true"
			>
				<div class="h-px w-full bg-brand-500/20"></div>
			</div>
			<div
				class="pointer-events-none absolute inset-0 flex items-center justify-center"
				aria-hidden="true"
			>
				<div class="h-full w-px bg-brand-500/20"></div>
			</div>
			<Center
				{axis}
				{align}
				{padding}
				maxWidth={props.maxWidth}
				minHeight="100%"
				fill
				class="h-full"
			>
				<div
					class="rounded-xl border border-brand-400/40 bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-brand-500/20"
				>
					Centered content
				</div>
			</Center>
		</div>
		<p class="mt-2 text-xs text-muted">
			axis=<span class="font-mono text-secondary">{axis}</span>
			· align=<span class="font-mono text-secondary">{align}</span>
			· padding=<span class="font-mono text-secondary">{padding}</span>
		</p>
	</div>

	<div class="grid gap-3 sm:grid-cols-3">
		{#each [
			{ axis: 'both' as const, label: 'Both axes' },
			{ axis: 'x' as const, label: 'Horizontal' },
			{ axis: 'y' as const, label: 'Vertical' }
		] as demo}
			<div class="rounded-xl border border-border bg-surface-elevated p-2">
				<p class="mb-2 px-1 text-[11px] font-medium text-muted">{demo.label}</p>
				<div class="h-28 rounded-lg bg-surface-overlay">
					<Center axis={demo.axis} minHeight="100%" fill class="h-full p-2">
						<span class="rounded-md bg-surface-elevated px-2 py-1 text-xs text-primary shadow-sm ring-1 ring-border">
							Box
						</span>
					</Center>
				</div>
			</div>
		{/each}
	</div>

	<div class="rounded-xl border border-border bg-surface-elevated p-3">
		<p class="mb-2 text-[11px] font-medium text-muted">With maxWidth (readable column)</p>
		<div class="h-32 rounded-lg bg-surface-overlay">
			<Center axis="both" maxWidth="16rem" padding="md" minHeight="100%" fill class="h-full">
				<p class="text-center text-xs leading-relaxed text-secondary">
					Useful for empty states, auth cards, or short marketing copy constrained inside a wide layout.
				</p>
			</Center>
		</div>
	</div>
</div>
