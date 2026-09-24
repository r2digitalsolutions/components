<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import type { CanvasPage } from '$lib/utils/canvasDocument.js';
	import Plus from '@lucide/svelte/icons/plus';
	import Copy from '@lucide/svelte/icons/copy';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	interface CanvasPageStripProps {
		pages: CanvasPage[];
		activeId: string;
		onselect: (id: string) => void;
		onadd: () => void;
		onduplicate: (id: string) => void;
		ondelete: (id: string) => void;
		onmove: (id: string, direction: -1 | 1) => void;
	}

	let { pages, activeId, onselect, onadd, onduplicate, ondelete, onmove }: CanvasPageStripProps =
		$props();

	let open = $state(false);

	const activeIndex = $derived(Math.max(0, pages.findIndex((page) => page.id === activeId)));
	const active = $derived(pages[activeIndex] ?? pages[0]);

	function pick(id: string) {
		onselect(id);
		open = false;
	}
</script>

<div class="relative">
	<div
		class="border-border bg-neutral-100 dark:bg-neutral-900 gap-0.5 rounded-xl p-1 shadow-lg flex items-center border"
		aria-label="Hojas"
	>
		<button
			type="button"
			class="rounded-md relative h-11 w-9 overflow-hidden border border-border"
			style:background-color={active?.background ?? '#ffffff'}
			aria-current="true"
			aria-label={`${active?.name?.trim() || `Hoja ${activeIndex + 1}`}, ${activeIndex + 1} de ${pages.length}`}
			onclick={() => (open = !open)}
		>
			<span
				class="bottom-0.5 left-0.5 rounded-sm bg-white/90 px-0.5 text-[10px] font-semibold leading-none text-neutral-900 absolute"
			>
				{activeIndex + 1}
			</span>
		</button>
		<span class="text-neutral-700 dark:text-neutral-200 px-1 text-[11px] font-medium tabular-nums">
			{activeIndex + 1} de {pages.length}
		</span>
		<IconButton label="Añadir hoja" size="sm" onclick={onadd}>
			<Plus class="h-4 w-4" />
		</IconButton>
		<IconButton
			label={open ? 'Cerrar hojas' : 'Ver hojas'}
			size="sm"
			onclick={() => (open = !open)}
		>
			<ChevronDown class={['h-4 w-4 transition-transform', open && 'rotate-180']} />
		</IconButton>
	</div>

	{#if open}
		<div
			class="border-border bg-surface-elevated bottom-full rounded-xl p-2 shadow-lg absolute left-1/2 mb-2 w-72 -translate-x-1/2 border"
		>
			<div class="gap-2 flex overflow-x-auto pb-1">
				{#each pages as page, index (page.id)}
					{@const selected = page.id === activeId}
					<button
						type="button"
						class={[
							'rounded-md relative h-16 w-12 shrink-0 overflow-hidden border',
							selected ? 'border-neutral-950 ring-2 ring-neutral-950 dark:border-neutral-50 dark:ring-neutral-50' : 'border-border'
						]}
						style:background-color={page.background}
						aria-current={selected ? 'true' : undefined}
						aria-label={page.name?.trim() || `Hoja ${index + 1}`}
						onclick={() => pick(page.id)}
					>
						<span
							class="bottom-0.5 left-0.5 rounded-sm bg-white/90 px-0.5 text-[10px] font-semibold leading-none text-neutral-900 absolute"
						>
							{index + 1}
						</span>
					</button>
				{/each}
			</div>
			{#if active}
				<div class="mt-1 flex items-center justify-between">
					<span class="text-secondary min-w-0 truncate text-xs">
						{active.name?.trim() || `Hoja ${activeIndex + 1}`}
						<span class="text-muted">· {activeIndex + 1} de {pages.length}</span>
					</span>
					<div class="flex shrink-0">
						<IconButton
							label="Mover a la izquierda"
							size="xs"
							disabled={activeIndex === 0}
							onclick={() => onmove(active.id, -1)}
						>
							<ChevronLeft class="h-3 w-3" />
						</IconButton>
						<IconButton
							label="Mover a la derecha"
							size="xs"
							disabled={activeIndex >= pages.length - 1}
							onclick={() => onmove(active.id, 1)}
						>
							<ChevronRight class="h-3 w-3" />
						</IconButton>
						<IconButton label="Duplicar hoja" size="xs" onclick={() => onduplicate(active.id)}>
							<Copy class="h-3 w-3" />
						</IconButton>
						<IconButton
							label="Eliminar hoja"
							size="xs"
							variant="destructive"
							disabled={pages.length < 2}
							onclick={() => ondelete(active.id)}
						>
							<Trash2 class="h-3 w-3" />
						</IconButton>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
