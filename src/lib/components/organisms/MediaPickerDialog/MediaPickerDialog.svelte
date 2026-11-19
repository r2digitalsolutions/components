<script lang="ts">
	import Dialog from '$lib/components/organisms/Dialog/Dialog.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Check from '@lucide/svelte/icons/check';
	import ImageIcon from '@lucide/svelte/icons/image';
	import Search from '@lucide/svelte/icons/search';
	import Upload from '@lucide/svelte/icons/upload';

	export interface MediaPickerItem {
		id: string;
		src: string;
		/** Caption / file name, searchable. */
		title?: string;
		/** Album or folder; null/undefined = not in any. */
		albumId?: string | null;
	}

	export interface MediaPickerAlbum {
		id: string;
		name: string;
	}

	interface MediaPickerDialogProps {
		open?: boolean;
		title?: string;
		description?: string;
		items?: MediaPickerItem[];
		albums?: MediaPickerAlbum[];
		/** Selected id(s). */
		value?: string[];
		multiple?: boolean;
		/** Show the «Subir» button (calls `onupload` with the chosen files). */
		uploadable?: boolean;
		uploading?: boolean;
		accept?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		uploadLabel?: string;
		emptyTitle?: string;
		emptyDescription?: string;
		onconfirm?: (ids: string[], items: MediaPickerItem[]) => void;
		onupload?: (files: File[]) => void;
		oncancel?: () => void;
	}

	let {
		open = $bindable(false),
		title = 'Elige una foto',
		description,
		items = [],
		albums = [],
		value = $bindable([]),
		multiple = false,
		uploadable = false,
		uploading = false,
		accept = 'image/*',
		confirmLabel = 'Usar foto',
		cancelLabel = 'Cancelar',
		uploadLabel = 'Subir',
		emptyTitle = 'No hay fotos',
		emptyDescription = 'Sube una foto para poder elegirla.',
		onconfirm,
		onupload,
		oncancel
	}: MediaPickerDialogProps = $props();

	/** 'all' · 'none' (no album) · album id */
	let filter = $state('all');
	let query = $state('');
	let fileInput = $state<HTMLInputElement>();

	const counts = $derived.by(() => {
		const c = new Map<string, number>();
		for (const i of items) c.set(i.albumId ?? 'none', (c.get(i.albumId ?? 'none') ?? 0) + 1);
		return c;
	});
	const shown = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return items.filter(
			(i) =>
				(filter === 'all' || (filter === 'none' ? !i.albumId : i.albumId === filter)) &&
				(!q || (i.title ?? '').toLowerCase().includes(q))
		);
	});

	function toggle(id: string) {
		if (!multiple) value = [id];
		else value = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
	}
	function confirm() {
		onconfirm?.(
			value,
			items.filter((i) => value.includes(i.id))
		);
		open = false;
	}
	function cancel() {
		oncancel?.();
		open = false;
	}
	function picked(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const files = [...(input.files ?? [])];
		if (files.length) onupload?.(files);
		input.value = '';
	}
</script>

<Dialog bind:open {title} {description} size="xl" scrollable oncancel={cancel}>
	<div class="gap-3 flex flex-col">
		<div class="gap-2 sm:flex-row sm:items-center flex flex-col">
			<Input type="search" placeholder="Buscar por nombre o pie de foto" bind:value={query} clearable class="flex-1">
				{#snippet leadIcon()}<Search class="h-4 w-4" />{/snippet}
			</Input>
			{#if uploadable}
				<input bind:this={fileInput} type="file" {accept} multiple class="hidden" onchange={picked} />
				<Button variant="outline" loading={uploading} onclick={() => fileInput?.click()}
					><Upload class="h-4 w-4" />{uploadLabel}</Button
				>
			{/if}
		</div>
		<div class="-mx-1 gap-1.5 px-1 pb-1 flex overflow-x-auto" role="group" aria-label="Filtrar por álbum">
			<Chip size="sm" selected={filter === 'all'} onclick={() => (filter = 'all')}>Todas · {items.length}</Chip>
			{#if counts.get('none')}
				<Chip size="sm" selected={filter === 'none'} onclick={() => (filter = 'none')}
					>Sin álbum · {counts.get('none')}</Chip
				>
			{/if}
			{#each albums as a (a.id)}
				{#if counts.get(a.id)}
					<Chip size="sm" selected={filter === a.id} onclick={() => (filter = a.id)}
						>{a.name} · {counts.get(a.id)}</Chip
					>
				{/if}
			{/each}
		</div>
		{#if shown.length}
			<ul class="gap-2.5 grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))]">
				{#each shown as item (item.id)}
					{@const on = value.includes(item.id)}
					<li>
						<button
							type="button"
							class={[
								'group rounded-xl relative block w-full overflow-hidden outline-2 outline-offset-2 transition',
								on ? 'outline-brand-600 outline' : 'outline-transparent hover:opacity-90'
							]}
							aria-pressed={on}
							title={item.title}
							onclick={() => toggle(item.id)}
						>
							<img src={item.src} alt={item.title ?? ''} loading="lazy" class="block aspect-[4/3] w-full object-cover" />
							{#if on}
								<span class="right-1.5 top-1.5 h-6 w-6 bg-brand-600 text-white absolute flex items-center justify-center rounded-full shadow"
									><Check class="h-4 w-4" strokeWidth={3} /></span
								>
							{/if}
							{#if item.title}
								<span class="inset-x-0 bottom-0 px-2 pb-1.5 pt-4 text-white absolute truncate bg-gradient-to-t from-black/55 to-transparent text-left text-[11px]"
									>{item.title}</span
								>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<EmptyState size="sm" title={items.length ? 'Nada con ese filtro' : emptyTitle} description={items.length ? 'Prueba con otro álbum o búsqueda.' : emptyDescription}>
				{#snippet icon()}<ImageIcon class="h-5 w-5" />{/snippet}
			</EmptyState>
		{/if}
	</div>
	{#snippet footer()}
		<span class="text-sm text-muted mr-auto">{value.length ? (multiple ? `${value.length} elegidas` : '1 elegida') : ''}</span>
		<Button variant="outline" onclick={cancel}>{cancelLabel}</Button>
		<Button disabled={!value.length} onclick={confirm}>{confirmLabel}</Button>
	{/snippet}
</Dialog>
