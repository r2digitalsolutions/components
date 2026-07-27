<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import EntityPreview from '$lib/components/molecules/EntityPreview/EntityPreview.svelte';
	import Spinner from '$lib/components/atoms/Spinner/Spinner.svelte';

	export interface RelationOption {
		id: string;
		title: string;
		subtitle?: string;
		meta?: string;
		image?: string;
		kind?: string;
	}

	interface RelationPickerProps {
		options?: RelationOption[];
		value?: string | string[];
		multiple?: boolean;
		placeholder?: string;
		loading?: boolean;
		disabled?: boolean;
		emptyLabel?: string;
		class?: string;
		onsearch?: (query: string) => void;
		onchange?: (value: string | string[]) => void;
		loadOptions?: (query: string) => Promise<RelationOption[]>;
	}

	let {
		options = [],
		value = $bindable<string | string[]>(''),
		multiple = false,
		placeholder = 'Search related records…',
		loading = false,
		disabled = false,
		emptyLabel = 'No results',
		class: className = '',
		onsearch,
		onchange,
		loadOptions
	}: RelationPickerProps = $props();

	let query = $state('');
	let open = $state(false);
	let remote = $state<RelationOption[] | null>(null);
	let busy = $state(false);

	const selectedIds = $derived(
		multiple
			? Array.isArray(value)
				? value
				: value
					? [value]
					: []
			: typeof value === 'string' && value
				? [value]
				: Array.isArray(value)
					? value.slice(0, 1)
					: []
	);

	const pool = $derived(remote ?? options);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return pool;
		return pool.filter(
			(o) =>
				o.title.toLowerCase().includes(q) ||
				o.subtitle?.toLowerCase().includes(q) ||
				o.id.toLowerCase().includes(q)
		);
	});

	const selectedOptions = $derived(
		selectedIds
			.map((id) => pool.find((o) => o.id === id) ?? options.find((o) => o.id === id))
			.filter(Boolean) as RelationOption[]
	);

	let searchTimer: ReturnType<typeof setTimeout> | undefined;

	async function runSearch(q: string) {
		onsearch?.(q);
		if (!loadOptions) {
			remote = null;
			return;
		}
		busy = true;
		try {
			remote = await loadOptions(q);
		} finally {
			busy = false;
		}
	}

	function onQueryInput(e: Event) {
		query = (e.currentTarget as HTMLInputElement).value;
		open = true;
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => runSearch(query), 200);
	}

	function toggle(id: string) {
		if (multiple) {
			const set = new Set(selectedIds);
			if (set.has(id)) set.delete(id);
			else set.add(id);
			value = [...set];
		} else {
			value = id;
			open = false;
			query = '';
		}
		onchange?.(value);
	}

	function remove(id: string) {
		if (multiple) {
			value = selectedIds.filter((x) => x !== id);
		} else {
			value = '';
		}
		onchange?.(value);
	}
</script>

<div class={['relative flex flex-col gap-2', className]} data-relation-picker>
	{#if selectedOptions.length}
		<div class="flex flex-wrap gap-1.5">
			{#each selectedOptions as opt (opt.id)}
				<Chip size="sm" variant="primary" dismissible ondismiss={() => remove(opt.id)}>
					{opt.title}
				</Chip>
			{/each}
		</div>
	{/if}

	<Input
		value={query}
		{placeholder}
		{disabled}
		oninput={onQueryInput}
		onfocus={() => (open = true)}
	/>

	{#if open && !disabled}
		<div
			class="absolute top-full z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-surface-elevated p-1 shadow-lg"
			role="listbox"
		>
			{#if loading || busy}
				<div class="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted">
					<Spinner size="sm" /> Searching…
				</div>
			{:else if filtered.length === 0}
				<p class="px-3 py-6 text-center text-sm text-muted">{emptyLabel}</p>
			{:else}
				{#each filtered as opt (opt.id)}
					<button
						type="button"
						class="w-full rounded-lg p-1 text-left hover:bg-surface-overlay"
						role="option"
						aria-selected={selectedIds.includes(opt.id)}
						onclick={() => toggle(opt.id)}
					>
						<EntityPreview
							title={opt.title}
							subtitle={opt.subtitle}
							meta={opt.meta}
							image={opt.image}
							kind={opt.kind}
						/>
					</button>
				{/each}
			{/if}
		</div>
	{/if}
</div>
