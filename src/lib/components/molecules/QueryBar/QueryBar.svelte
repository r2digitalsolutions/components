<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import type { FilterFieldDef } from '$lib/components/molecules/AdvancedFilters/AdvancedFilters.svelte';
	import {
		tokenizeQuery,
		validateQuery,
		KEYWORDS,
		type QueryTokenKind
	} from '$lib/utils/queryBar.js';

	export interface QuerySuggestion {
		value: string;
		label: string;
		detail?: string;
		kind: 'field' | 'operator' | 'value' | 'keyword';
	}

	interface QueryBarProps {
		value?: string;
		fields?: FilterFieldDef[];
		history?: string[];
		placeholder?: string;
		disabled?: boolean;
		submitLabel?: string;
		class?: string;
		onsubmit?: (query: string) => void;
		onchange?: (query: string) => void;
	}

	let {
		value = $bindable(''),
		fields = [],
		history = [],
		placeholder = 'Search… e.g. brand:nike AND price>=50',
		disabled = false,
		submitLabel = 'Search',
		class: className = '',
		onsubmit,
		onchange
	}: QueryBarProps = $props();

	let inputEl = $state<HTMLInputElement | null>(null);
	let open = $state(false);
	let highlight = $state(0);

	const fieldIds = $derived(fields.map((f) => f.id));
	const tokens = $derived(tokenizeQuery(value, fieldIds));
	const syntaxError = $derived(validateQuery(value));

	const caretWord = $derived.by(() => {
		const m = value.match(/([^\s]*)$/);
		return m?.[1] ?? '';
	});

	const suggestions = $derived.by((): QuerySuggestion[] => {
		const word = caretWord;
		const lower = word.toLowerCase();
		const items: QuerySuggestion[] = [];

		for (const f of fields) {
			if (!lower || f.id.toLowerCase().startsWith(lower) || f.label.toLowerCase().includes(lower)) {
				items.push({
					value: f.id,
					label: f.id,
					detail: f.label,
					kind: 'field'
				});
			}
		}

		for (const kw of KEYWORDS) {
			if (!lower || kw.toLowerCase().startsWith(lower)) {
				items.push({ value: kw, label: kw, kind: 'keyword' });
			}
		}

		const activeField = fields.find((f) => {
			const re = new RegExp(`(?:^|[\\s(])${f.id}\\s*(:|=)\\s*([^\\s]*)$`, 'i');
			return re.test(value);
		});
		if (activeField?.options) {
			const m = value.match(new RegExp(`${activeField.id}\\s*(?::|=)\\s*([^\\s]*)$`, 'i'));
			const partial = (m?.[1] ?? '').replace(/^"/, '').toLowerCase();
			for (const opt of activeField.options) {
				if (
					!partial ||
					opt.value.toLowerCase().startsWith(partial) ||
					opt.label.toLowerCase().includes(partial)
				) {
					items.push({
						value: opt.value,
						label: opt.label,
						detail: activeField.id,
						kind: 'value'
					});
				}
			}
		}

		for (const h of history) {
			if (!lower || h.toLowerCase().includes(lower)) {
				items.push({ value: h, label: h, detail: 'History', kind: 'keyword' });
			}
		}

		return items.slice(0, 10);
	});

	const tokenColor: Record<QueryTokenKind, string> = {
		field: 'text-sky-600 dark:text-sky-400',
		operator: 'text-amber-600 dark:text-amber-400',
		value: 'text-emerald-600 dark:text-emerald-400',
		keyword: 'text-violet-600 dark:text-violet-400',
		text: 'text-primary',
		error: 'text-red-600'
	};

	function applySuggestion(s: QuerySuggestion) {
		if (s.detail === 'History' && history.includes(s.value)) {
			value = s.value;
		} else {
			const before = value.slice(0, value.length - caretWord.length);
			if (s.kind === 'field') {
				value = `${before}${s.value}:`;
			} else if (s.kind === 'value') {
				const withoutPartial = value.replace(/(:|=)\s*[^\s]*$/, `$1${s.value}`);
				value = withoutPartial === value ? `${before}${s.value}` : withoutPartial;
			} else {
				value = `${before}${s.value} `;
			}
		}
		onchange?.(value);
		open = false;
		inputEl?.focus();
	}

	function submit() {
		if (disabled) return;
		onsubmit?.(value);
		open = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' && open && suggestions.length) {
			e.preventDefault();
			highlight = (highlight + 1) % suggestions.length;
		} else if (e.key === 'ArrowUp' && open && suggestions.length) {
			e.preventDefault();
			highlight = (highlight - 1 + suggestions.length) % suggestions.length;
		} else if (e.key === 'Enter') {
			if (open && suggestions[highlight]) {
				e.preventDefault();
				applySuggestion(suggestions[highlight]);
			} else {
				e.preventDefault();
				submit();
			}
		} else if (e.key === 'Escape') {
			open = false;
		}
	}
</script>

<div class={['w-full', className]}>
	<div
		class={[
			'flex flex-col gap-2 rounded-2xl border bg-surface-elevated p-2 shadow-sm sm:flex-row sm:items-stretch',
			syntaxError ? 'border-amber-500/50' : 'border-border'
		]}
	>
		<div class="relative min-w-0 flex-1">
			<div
				class="mb-1 flex min-h-[1.25rem] flex-wrap gap-x-0.5 px-3 pt-1 font-mono text-[11px] leading-4"
				aria-hidden="true"
			>
				{#if tokens.length}
					{#each tokens as t}
						<span class={tokenColor[t.kind]}>{t.text}</span>
					{/each}
				{:else}
					<span class="text-muted">&nbsp;</span>
				{/if}
			</div>
			<input
				bind:this={inputEl}
				type="search"
				class="w-full rounded-xl border-0 bg-transparent px-3 py-1.5 font-mono text-sm text-primary outline-none ring-0 placeholder:text-muted focus:ring-0"
				{placeholder}
				{disabled}
				bind:value
				role="combobox"
				aria-expanded={open}
				aria-autocomplete="list"
				aria-controls="querybar-suggestions"
				oninput={() => {
					onchange?.(value);
					open = true;
					highlight = 0;
				}}
				onfocus={() => (open = true)}
				onblur={() => setTimeout(() => (open = false), 120)}
				onkeydown={onKeydown}
			/>

			{#if open && suggestions.length && !disabled}
				<ul
					id="querybar-suggestions"
					class="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-surface-elevated py-1 shadow-lg"
					role="listbox"
				>
					{#each suggestions as s, i (s.kind + s.value + (s.detail ?? ''))}
						<li role="option" aria-selected={i === highlight}>
							<button
								type="button"
								class={[
									'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm',
									i === highlight
										? 'bg-brand-500/10 text-primary'
										: 'text-secondary hover:bg-surface-overlay'
								]}
								onmousedown={(e) => {
									e.preventDefault();
									applySuggestion(s);
								}}
							>
								<span class="font-mono text-xs">
									<span
										class={s.kind === 'field'
											? 'text-sky-600 dark:text-sky-400'
											: s.kind === 'value'
												? 'text-emerald-600 dark:text-emerald-400'
												: 'text-violet-600 dark:text-violet-400'}
									>
										{s.label}
									</span>
								</span>
								{#if s.detail}
									<span class="truncate text-[11px] text-muted">{s.detail}</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		<Button
			variant="primary"
			size="sm"
			{disabled}
			onclick={submit}
			class="shrink-0 self-end sm:self-center"
		>
			{submitLabel}
		</Button>
	</div>
	{#if syntaxError}
		<p class="mt-1.5 text-xs text-amber-600 dark:text-amber-400">{syntaxError}</p>
	{/if}
</div>
