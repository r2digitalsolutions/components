<script lang="ts">
	export interface MentionSuggestion {
		id: string;
		label: string;
		description?: string;
	}

	interface MentionInputProps {
		value?: string;
		suggestions?: MentionSuggestion[];
		placeholder?: string;
		rows?: number;
		class?: string;
		onselect?: (item: MentionSuggestion) => void;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		suggestions = [],
		placeholder = 'Write a message… use @ to mention',
		rows = 3,
		class: className = '',
		onselect,
		onchange
	}: MentionInputProps = $props();

	let open = $state(false);
	let query = $state('');
	let caret = $state(0);

	const filtered = $derived(
		suggestions.filter((s) => s.label.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
	);

	function onInput(e: Event) {
		const el = e.currentTarget as HTMLTextAreaElement;
		value = el.value;
		caret = el.selectionStart ?? value.length;
		onchange?.(value);

		const before = value.slice(0, caret);
		const match = before.match(/@([\w.-]*)$/);
		if (match) {
			query = match[1] ?? '';
			open = true;
		} else {
			open = false;
			query = '';
		}
	}

	function insert(item: MentionSuggestion) {
		const before = value.slice(0, caret);
		const after = value.slice(caret);
		const replaced = before.replace(/@[\w.-]*$/, `@${item.label} `);
		value = replaced + after;
		open = false;
		onselect?.(item);
		onchange?.(value);
	}
</script>

<div class={['relative w-full', className]}>
	<textarea
		class="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-brand-500/30"
		{placeholder}
		{rows}
		{value}
		oninput={onInput}
	></textarea>

	{#if open && filtered.length}
		<ul
			class="absolute bottom-full left-0 z-20 mb-1 max-h-48 w-full overflow-auto rounded-xl border border-border bg-surface-elevated py-1 shadow-lg"
			role="listbox"
		>
			{#each filtered as item (item.id)}
				<li>
					<button
						type="button"
						class="flex w-full flex-col px-3 py-2 text-left hover:bg-surface-overlay"
						onclick={() => insert(item)}
					>
						<span class="text-sm font-medium text-primary">@{item.label}</span>
						{#if item.description}
							<span class="text-xs text-muted">{item.description}</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
