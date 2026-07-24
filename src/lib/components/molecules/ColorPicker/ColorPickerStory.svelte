<script lang="ts">
	import ColorPicker, { type ColorFormat } from './ColorPicker.svelte';

	let {
		alpha = false,
		format = 'hex',
		showSwatches = true,
		disabled = false,
		label = 'Brand color',
		preset = 'default',
		initiallyOpen = false
	}: {
		alpha?: boolean;
		format?: ColorFormat;
		showSwatches?: boolean;
		disabled?: boolean;
		label?: string;
		preset?: 'default' | 'brand' | 'pastel' | 'neon';
		initiallyOpen?: boolean;
	} = $props();

	const palettes: Record<string, string[]> = {
		default: [
			'#6366f1',
			'#22c55e',
			'#f59e0b',
			'#ef4444',
			'#0ea5e9',
			'#ec4899',
			'#8b5cf6',
			'#14b8a6',
			'#111827',
			'#f8fafc',
			'rgba(99,102,241,0.35)',
			'transparent'
		],
		brand: ['#312e81', '#4338ca', '#6366f1', '#818cf8', '#c7d2fe', '#eef2ff'],
		pastel: ['#fecdd3', '#fde68a', '#bbf7d0', '#a5f3fc', '#ddd6fe', '#f5d0fe'],
		neon: ['#22d3ee', '#a3e635', '#f472b6', '#facc15', '#fb7185', '#c084fc']
	};

	let value = $state(alpha ? '#6366f180' : '#6366f1');
	let open = $state(initiallyOpen);
</script>

<div class="min-h-80 w-72 max-w-full space-y-3">
	<ColorPicker
		bind:value
		bind:open
		{label}
		{alpha}
		{format}
		{showSwatches}
		{disabled}
		swatches={palettes[preset]}
	/>
	<p class="font-mono text-xs text-muted">
		Value: <span class="text-primary">{value}</span>
	</p>
</div>
