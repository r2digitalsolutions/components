<script lang="ts">
	interface ColorPickerProps {
		value?: string;
		swatches?: string[];
		label?: string;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable('#6366f1'),
		swatches = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#0ea5e9', '#ec4899', '#111827', '#f8fafc'],
		label,
		class: className = '',
		onchange
	}: ColorPickerProps = $props();

	function set(next: string) {
		value = next;
		onchange?.(next);
	}
</script>

<div class={['flex w-full flex-col gap-2', className]}>
	{#if label}
		<label class="text-sm font-medium text-primary">{label}</label>
	{/if}
	<div class="flex items-center gap-3">
		<label class="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border shadow-sm">
			<span class="absolute inset-0" style={`background:${value}`}></span>
			<input
				type="color"
				bind:value
				onchange={() => onchange?.(value)}
				class="absolute inset-0 cursor-pointer opacity-0"
				aria-label={label ?? 'Pick color'}
			/>
		</label>
		<input
			type="text"
			bind:value
			onchange={() => onchange?.(value)}
			class="h-10 flex-1 rounded-lg border border-border bg-surface-elevated px-3 font-mono text-sm text-primary outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
		/>
	</div>
	<div class="flex flex-wrap gap-2">
		{#each swatches as swatch (swatch)}
			<button
				type="button"
				onclick={() => set(swatch)}
				class={[
					'h-7 w-7 rounded-full border border-border shadow-sm transition-transform hover:scale-110',
					value.toLowerCase() === swatch.toLowerCase() && 'ring-2 ring-brand-500 ring-offset-2 ring-offset-surface'
				]}
				style={`background:${swatch}`}
				aria-label={`Select ${swatch}`}
			></button>
		{/each}
	</div>
</div>
