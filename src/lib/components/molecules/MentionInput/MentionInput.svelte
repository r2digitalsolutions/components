<script lang="ts">
	export interface MentionSuggestion {
		id: string;
		label: string;
		description?: string;
		/** Optional avatar URL */
		avatar?: string;
		/** Optional secondary handle / email */
		meta?: string;
		disabled?: boolean;
	}

	interface MentionInputProps {
		value?: string;
		suggestions?: MentionSuggestion[];
		placeholder?: string;
		label?: string;
		helperText?: string;
		rows?: number;
		disabled?: boolean;
		readonly?: boolean;
		/** Character that opens mentions. Default `@`. */
		trigger?: string;
		/** Max suggestions shown. */
		maxSuggestions?: number;
		/** Dropdown above or below the field. */
		placement?: 'top' | 'bottom';
		class?: string;
		onselect?: (item: MentionSuggestion) => void;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		suggestions = [],
		placeholder = 'Write a message… use @ to mention',
		label = '',
		helperText = '',
		rows = 3,
		disabled = false,
		readonly = false,
		trigger = '@',
		maxSuggestions = 8,
		placement = 'top',
		class: className = '',
		onselect,
		onchange
	}: MentionInputProps = $props();

	let open = $state(false);
	let query = $state('');
	let caret = $state(0);
	let activeIndex = $state(0);
	let textareaEl = $state<HTMLTextAreaElement | null>(null);
	let listEl = $state<HTMLUListElement | null>(null);

	const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	const filtered = $derived.by(() => {
		const q = query.toLowerCase();
		return suggestions
			.filter((s) => {
				if (s.disabled) return false;
				if (!q) return true;
				return (
					s.label.toLowerCase().includes(q) ||
					(s.description?.toLowerCase().includes(q) ?? false) ||
					(s.meta?.toLowerCase().includes(q) ?? false)
				);
			})
			.slice(0, maxSuggestions);
	});

	const showList = $derived(open && !disabled && !readonly);
	const listId = 'mention-listbox';

	function detectMention(text: string, pos: number) {
		const before = text.slice(0, pos);
		const re = new RegExp(`${escapeRegExp(trigger)}([\\w.-]*)$`);
		const match = before.match(re);
		if (!match) return null;
		return { query: match[1] ?? '', start: match.index ?? 0 };
	}

	function syncFromCaret(text: string, pos: number) {
		const mention = detectMention(text, pos);
		if (mention) {
			query = mention.query;
			open = true;
			activeIndex = 0;
		} else {
			open = false;
			query = '';
			activeIndex = 0;
		}
	}

	function onInput(e: Event) {
		const el = e.currentTarget as HTMLTextAreaElement;
		value = el.value;
		caret = el.selectionStart ?? value.length;
		onchange?.(value);
		syncFromCaret(value, caret);
	}

	function onSelect() {
		if (!textareaEl) return;
		caret = textareaEl.selectionStart ?? value.length;
		syncFromCaret(value, caret);
	}

	function insert(item: MentionSuggestion) {
		if (item.disabled || !textareaEl) return;

		const before = value.slice(0, caret);
		const after = value.slice(caret);
		const re = new RegExp(`${escapeRegExp(trigger)}[\\w.-]*$`);
		const replaced = before.replace(re, `${trigger}${item.label} `);
		const nextCaret = replaced.length;

		value = replaced + after;
		open = false;
		query = '';
		activeIndex = 0;
		onselect?.(item);
		onchange?.(value);

		requestAnimationFrame(() => {
			if (!textareaEl) return;
			textareaEl.focus();
			textareaEl.setSelectionRange(nextCaret, nextCaret);
			caret = nextCaret;
		});
	}

	function moveActive(delta: number) {
		if (!filtered.length) return;
		activeIndex = (activeIndex + delta + filtered.length) % filtered.length;
		scrollActiveIntoView();
	}

	function scrollActiveIntoView() {
		requestAnimationFrame(() => {
			const el = listEl?.querySelector<HTMLElement>(`[data-mention-index="${activeIndex}"]`);
			el?.scrollIntoView({ block: 'nearest' });
		});
	}

	function onKeyDown(e: KeyboardEvent) {
		if (disabled || readonly) return;

		if (!showList || !filtered.length) {
			// Allow Escape to no-op; reopen on @ via input
			if (e.key === 'Escape' && open) {
				e.preventDefault();
				open = false;
			}
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				moveActive(1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				moveActive(-1);
				break;
			case 'Enter':
			case 'Tab':
				e.preventDefault();
				insert(filtered[activeIndex] ?? filtered[0]);
				break;
			case 'Escape':
				e.preventDefault();
				open = false;
				query = '';
				break;
		}
	}

	function initials(label: string) {
		return label.slice(0, 2).toUpperCase();
	}

	function highlight(text: string, q: string) {
		if (!q) return [{ text, match: false }];
		const lower = text.toLowerCase();
		const iq = q.toLowerCase();
		const i = lower.indexOf(iq);
		if (i < 0) return [{ text, match: false }];
		return [
			{ text: text.slice(0, i), match: false },
			{ text: text.slice(i, i + q.length), match: true },
			{ text: text.slice(i + q.length), match: false }
		].filter((p) => p.text);
	}

	$effect(() => {
		// Keep activeIndex in range when filter shrinks
		if (activeIndex >= filtered.length) {
			activeIndex = Math.max(0, filtered.length - 1);
		}
	});
</script>

<div class={['flex w-full flex-col gap-1.5', className]}>
	{#if label}
		<label class="text-sm font-medium text-primary" for="mention-input">{label}</label>
	{/if}

	<div class="relative">
		<textarea
			bind:this={textareaEl}
			id="mention-input"
			class={[
				'w-full resize-y rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-primary shadow-sm',
				'placeholder:text-muted outline-none transition',
				'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
				disabled && 'cursor-not-allowed opacity-60',
				readonly && 'bg-surface'
			]}
			{placeholder}
			{rows}
			{disabled}
			{readonly}
			{value}
			role="combobox"
			aria-expanded={showList && filtered.length > 0}
			aria-controls={listId}
			aria-autocomplete="list"
			aria-activedescendant={showList && filtered.length
				? `mention-option-${filtered[activeIndex]?.id}`
				: undefined}
			oninput={onInput}
			onkeydown={onKeyDown}
			onselect={onSelect}
			onclick={onSelect}
			onkeyup={(e) => {
				if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') onSelect();
			}}
		></textarea>

		{#if showList}
			<div
				class={[
					'absolute left-0 z-30 w-full',
					placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
				]}
			>
				{#if filtered.length}
					<ul
						bind:this={listEl}
						id={listId}
						class="max-h-64 overflow-auto rounded-xl border border-border bg-surface-elevated py-1.5 shadow-xl"
						role="listbox"
						aria-label="Mention suggestions"
					>
						<li class="px-3 pb-1.5 pt-1 text-[10px] font-medium uppercase tracking-wide text-muted">
							Mentions
							{#if query}
								<span class="normal-case tracking-normal text-secondary"> · {trigger}{query}</span>
							{/if}
						</li>
						{#each filtered as item, i (item.id)}
							{@const active = i === activeIndex}
							<li role="presentation">
								<button
									type="button"
									id="mention-option-{item.id}"
									data-mention-index={i}
									role="option"
									aria-selected={active}
									class={[
										'flex w-full items-center gap-3 px-3 py-2 text-left transition-colors',
										active
											? 'bg-brand-50 dark:bg-brand-950/40'
											: 'hover:bg-surface-overlay'
									]}
									onmousedown={(e) => e.preventDefault()}
									onclick={() => insert(item)}
									onmouseenter={() => (activeIndex = i)}
								>
									{#if item.avatar}
										<img
											src={item.avatar}
											alt=""
											class="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-border"
										/>
									{:else}
										<span
											class={[
												'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
												active
													? 'bg-brand-500 text-white'
													: 'bg-surface-overlay text-secondary'
											]}
										>
											{initials(item.label)}
										</span>
									{/if}

									<span class="min-w-0 flex-1">
										<span class="block truncate text-sm font-medium text-primary">
											{trigger}{#each highlight(item.label, query) as part}
												{#if part.match}
													<mark class="rounded-sm bg-brand-500/20 text-brand-700 dark:text-brand-300"
														>{part.text}</mark
													>
												{:else}
													{part.text}
												{/if}
											{/each}
										</span>
										{#if item.description || item.meta}
											<span class="block truncate text-xs text-muted">
												{item.description ?? item.meta}
											</span>
										{/if}
									</span>

									{#if active}
										<span class="hidden shrink-0 text-[10px] font-medium text-muted sm:inline">
											↵
										</span>
									{/if}
								</button>
							</li>
						{/each}
					</ul>
				{:else if query}
					<div
						class="rounded-xl border border-border bg-surface-elevated px-3 py-3 text-center text-sm text-muted shadow-xl"
						role="status"
					>
						No one matching “{query}”
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if helperText}
		<p class="text-xs text-muted">{helperText}</p>
	{:else}
		<p class="text-[11px] text-muted">
			<span class="font-medium text-secondary">{trigger}</span> to mention ·
			<kbd class="rounded border border-border bg-surface px-1 py-0.5 font-mono text-[10px]">↑</kbd>
			<kbd class="rounded border border-border bg-surface px-1 py-0.5 font-mono text-[10px]">↓</kbd>
			navigate ·
			<kbd class="rounded border border-border bg-surface px-1 py-0.5 font-mono text-[10px]">Enter</kbd>
			select ·
			<kbd class="rounded border border-border bg-surface px-1 py-0.5 font-mono text-[10px]">Esc</kbd>
			close
		</p>
	{/if}
</div>
