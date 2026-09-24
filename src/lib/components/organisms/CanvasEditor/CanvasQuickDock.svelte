<script lang="ts">
	import ColorPicker from '$lib/components/molecules/ColorPicker/ColorPicker.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import type { CanvasLayer } from '$lib/utils/canvasDocument.js';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import AlignCenter from '@lucide/svelte/icons/align-center';
	import AlignRight from '@lucide/svelte/icons/align-right';
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import Copy from '@lucide/svelte/icons/copy';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	interface CanvasQuickDockProps {
		layer: CanvasLayer;
		onpatch: (layer: CanvasLayer) => void;
		onduplicate: () => void;
		ondelete: () => void;
	}

	let { layer, onpatch, onduplicate, ondelete }: CanvasQuickDockProps = $props();

	const isText = $derived(layer.kind === 'text' || layer.kind === 'sticky');
	const fontOptions = [
		{ value: 'default', label: 'Default' },
		{ value: 'Inter, sans-serif', label: 'Inter' },
		{ value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
		{ value: 'Georgia, serif', label: 'Georgia' },
		{ value: '"Times New Roman", Times, serif', label: 'Times' },
		{ value: '"Courier New", Courier, monospace', label: 'Courier' }
	];
	const aligns = [
		{ id: 'left' as const, label: 'Alinear a la izquierda', icon: AlignLeft },
		{ id: 'center' as const, label: 'Centrar', icon: AlignCenter },
		{ id: 'right' as const, label: 'Alinear a la derecha', icon: AlignRight }
	];

	const size = $derived(layer.fontSize ?? 32);
	const bold = $derived(Number(layer.fontWeight ?? 600) >= 700);
	const italic = $derived(layer.fontStyle === 'italic');
	const underline = $derived(layer.textDecoration === 'underline');

	function patch(partial: Partial<CanvasLayer>) {
		onpatch({ ...layer, ...partial });
	}
</script>

<div
	class="border-border bg-neutral-100 dark:bg-neutral-900 gap-0.5 rounded-xl p-1 shadow-lg pointer-events-auto flex items-center border"
	role="toolbar"
	aria-label="Herramientas de la selección"
>
	{#if isText}
		<div class="w-36 shrink-0">
			<Select
				size="sm"
				listboxMinWidth={180}
				options={fontOptions}
				value={layer.fontFamily ?? 'default'}
				onchange={(value) => patch({ fontFamily: value === 'default' ? undefined : value })}
			/>
		</div>
		<div class="bg-border mx-0.5 h-5 w-px"></div>
		<IconButton label="Reducir tamaño" size="sm" onclick={() => patch({ fontSize: Math.max(8, size - 2) })}>
			<Minus class="h-3.5 w-3.5" />
		</IconButton>
		<span class="text-primary w-8 text-center text-xs tabular-nums">{Math.round(size)}</span>
		<IconButton label="Aumentar tamaño" size="sm" onclick={() => patch({ fontSize: Math.min(400, size + 2) })}>
			<Plus class="h-3.5 w-3.5" />
		</IconButton>
		<div class="bg-border mx-0.5 h-5 w-px"></div>
		<IconButton
			label="Negrita"
			size="sm"
			variant="ghost"
			class={bold ? 'bg-neutral-200 text-neutral-950 dark:bg-neutral-700 dark:text-neutral-50' : undefined}
			aria-pressed={bold}
			onclick={() => patch({ fontWeight: bold ? 400 : 700 })}
		>
			<Bold class="h-3.5 w-3.5" />
		</IconButton>
		<IconButton
			label="Cursiva"
			size="sm"
			variant="ghost"
			class={italic ? 'bg-neutral-200 text-neutral-950 dark:bg-neutral-700 dark:text-neutral-50' : undefined}
			aria-pressed={italic}
			onclick={() => patch({ fontStyle: italic ? 'normal' : 'italic' })}
		>
			<Italic class="h-3.5 w-3.5" />
		</IconButton>
		<IconButton
			label="Subrayado"
			size="sm"
			variant="ghost"
			class={underline ? 'bg-neutral-200 text-neutral-950 dark:bg-neutral-700 dark:text-neutral-50' : undefined}
			aria-pressed={underline}
			onclick={() => patch({ textDecoration: underline ? 'none' : 'underline' })}
		>
			<Underline class="h-3.5 w-3.5" />
		</IconButton>
		<ColorPicker size="xs" value={layer.color ?? '#0f172a'} onchange={(value) => patch({ color: value })} />
		<div class="bg-border mx-0.5 h-5 w-px"></div>
		{#each aligns as action (action.id)}
			{@const Icon = action.icon}
			{@const active = (layer.textAlign ?? 'left') === action.id}
			<IconButton
				label={action.label}
				size="sm"
				variant="ghost"
				class={active ? 'bg-neutral-200 text-neutral-950 dark:bg-neutral-700 dark:text-neutral-50' : undefined}
				aria-pressed={active}
				onclick={() => patch({ textAlign: action.id })}
			>
				<Icon class="h-3.5 w-3.5" />
			</IconButton>
		{/each}
		<div class="bg-border mx-0.5 h-5 w-px"></div>
	{:else if layer.fill}
		<ColorPicker size="xs" value={layer.fill} onchange={(value) => patch({ fill: value })} />
		<div class="bg-border mx-0.5 h-5 w-px"></div>
	{/if}
	<IconButton label="Duplicar" size="sm" onclick={onduplicate}>
		<Copy class="h-3.5 w-3.5" />
	</IconButton>
	<IconButton label="Eliminar" size="sm" variant="destructive" onclick={ondelete}>
		<Trash2 class="h-3.5 w-3.5" />
	</IconButton>
</div>
