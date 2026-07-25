<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import type { FilterFieldDef } from '$lib/utils/advancedFilters.js';
	import {
		DEFAULT_QUERY_EXAMPLES,
		KEYWORDS,
		operatorSuggestionsForField,
		tokenizeQuery,
		validateQuery,
		type QueryExample,
		type QueryTokenKind
	} from '$lib/utils/queryBar.js';

	export interface QuerySuggestion {
		value: string;
		label: string;
		detail?: string;
		kind: 'field' | 'operator' | 'value' | 'keyword' | 'example';
	}

	interface QueryBarProps {
		value?: string;
		fields?: FilterFieldDef[];
		history?: string[];
		examples?: QueryExample[];
		placeholder?: string;
		disabled?: boolean;
		submitLabel?: string;
		showExamples?: boolean;
		showFieldChips?: boolean;
		class?: string;
		onsubmit?: (query: string) => void;
		onchange?: (query: string) => void;
	}

	let {
		value = $bindable(''),
		fields = [],
		history = [],
		examples = DEFAULT_QUERY_EXAMPLES,
		placeholder = 'Search with field:value, AND / OR, (groups)…',
		disabled = false,
		submitLabel = 'Search',
		showExamples = true,
		showFieldChips = true,
		class: className = '',
		onsubmit,
		onchange
	}: QueryBarProps = $props();

	let inputEl = $state<HTMLInputElement | null>(null);
	let open = $state(false);
	let highlight = $state(0);
	let showHelp = $state(false);
	/** Prevent focus-after-clear from reopening suggestions */
	let suppressOpen = $state(false);

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

		const endsWithField = fields.find((f) => {
			const re = new RegExp(`(?:^|[\\s(])${f.id}$`, 'i');
			return re.test(value.trimEnd());
		});
		if (endsWithField && (!word || word === endsWithField.id)) {
			for (const op of operatorSuggestionsForField(endsWithField)) {
				items.push({
					value: op,
					label: op,
					detail: `${endsWithField.label} operator`,
					kind: 'operator'
				});
			}
		}

		for (const f of fields) {
			if (!lower || f.id.toLowerCase().startsWith(lower) || f.label.toLowerCase().includes(lower)) {
				items.push({
					value: f.id,
					label: f.id,
					detail: `${f.label} · ${f.type}`,
					kind: 'field'
				});
			}
		}

		for (const kw of KEYWORDS) {
			if (!lower || kw.toLowerCase().startsWith(lower)) {
				items.push({ value: kw, label: kw, kind: 'keyword', detail: 'Boolean' });
			}
		}

		const activeField = fields.find((f) => {
			const re = new RegExp(`(?:^|[\\s(])${f.id}\\s*(:|=|!=|>=|<=|>|<|~)\\s*([^\\s]*)$`, 'i');
			return re.test(value);
		});
		if (activeField?.options) {
			const m = value.match(
				new RegExp(`${activeField.id}\\s*(?::|=|!=|>=|<=|>|<|~)\\s*([^\\s]*)$`, 'i')
			);
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
				items.push({ value: h, label: h, detail: 'Recent', kind: 'example' });
			}
		}

		return items.slice(0, 12);
	});

	const tokenColor: Record<QueryTokenKind, string> = {
		field: 'text-sky-600 dark:text-sky-400',
		operator: 'text-amber-600 dark:text-amber-400',
		value: 'text-emerald-600 dark:text-emerald-400',
		keyword: 'text-violet-600 dark:text-violet-400',
		paren: 'text-orange-600 dark:text-orange-400',
		text: 'text-primary',
		error: 'text-red-600'
	};

	const kindBadge: Record<QuerySuggestion['kind'], string> = {
		field: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
		operator: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
		value: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
		keyword: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
		example: 'bg-surface-overlay text-muted'
	};

	function setValue(next: string) {
		value = next;
		onchange?.(next);
	}

	function applySuggestion(s: QuerySuggestion) {
		if (s.kind === 'example' || (s.detail === 'Recent' && history.includes(s.value))) {
			setValue(s.value);
		} else if (s.kind === 'operator') {
			const trimmed = value.trimEnd();
			const field = fields.find((f) => trimmed.endsWith(f.id));
			if (field) setValue(`${trimmed.slice(0, -field.id.length)}${field.id}${s.value}`);
			else setValue(`${trimmed}${s.value}`);
		} else {
			const before = value.slice(0, value.length - caretWord.length);
			if (s.kind === 'field') {
				setValue(`${before}${s.value}`);
			} else if (s.kind === 'value') {
				const withoutPartial = value.replace(/(:|=|!=|>=|<=|>|<|~)\s*[^\s]*$/, `$1${s.value}`);
				setValue(withoutPartial === value ? `${before}${s.value}` : withoutPartial);
			} else {
				setValue(`${before}${s.value} `);
			}
		}
		open = true;
		highlight = 0;
		queueMicrotask(() => inputEl?.focus());
	}

	function insertExample(ex: QueryExample) {
		setValue(ex.query);
		inputEl?.focus();
	}

	function insertField(fieldId: string) {
		const needsSpace = value.length > 0 && !/[\s(]$/.test(value);
		setValue(`${value}${needsSpace ? ' ' : ''}${fieldId}`);
		open = true;
		inputEl?.focus();
	}

	function clear(e?: MouseEvent) {
		e?.preventDefault();
		e?.stopPropagation();
		suppressOpen = true;
		open = false;
		setValue('');
		setTimeout(() => {
			suppressOpen = false;
		}, 100);
	}

	function submit() {
		if (disabled) return;
		if (syntaxError) {
			open = false;
			return;
		}
		onsubmit?.(value);
		open = false;
	}

	function onFocus() {
		if (suppressOpen) {
			open = false;
			return;
		}
		open = true;
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

<div class={['w-full space-y-2', className]}>
	<div
		class={[
			'rounded-2xl border bg-surface-elevated shadow-sm transition-colors',
			syntaxError
				? 'border-red-500/60 focus-within:border-red-500'
				: 'border-border focus-within:border-brand-500/40'
		]}
	>
		<!-- token preview -->
		<div
			class={[
				'flex min-h-[1.5rem] flex-wrap items-center gap-x-0.5 border-b px-3 py-1.5 font-mono text-[11px] leading-4',
				syntaxError ? 'border-red-500/20 bg-red-500/5' : 'border-border/60'
			]}
			aria-hidden="true"
		>
			{#if tokens.length}
				{#each tokens as t}
					<span class={syntaxError ? 'text-red-600 dark:text-red-400' : tokenColor[t.kind]}>{t.text}</span>
				{/each}
			{:else}
				<span class="text-muted">Syntax preview</span>
			{/if}
		</div>

		<div class="flex items-stretch gap-1 p-2">
			<div class="relative min-w-0 flex-1">
				<input
					bind:this={inputEl}
					type="text"
					class="w-full rounded-xl border-0 bg-transparent px-2 py-2 font-mono text-sm text-primary outline-none ring-0 placeholder:text-muted focus:ring-0"
					{placeholder}
					{disabled}
					bind:value
					role="combobox"
					aria-expanded={open}
					aria-autocomplete="list"
					aria-controls="querybar-suggestions"
					aria-invalid={Boolean(syntaxError)}
					aria-describedby={syntaxError ? 'querybar-error' : undefined}
					oninput={() => {
						onchange?.(value);
						if (!suppressOpen) {
							open = true;
							highlight = 0;
						}
					}}
					onfocus={onFocus}
					onblur={() => setTimeout(() => (open = false), 140)}
					onkeydown={onKeydown}
				/>

				{#if open && suggestions.length && !disabled}
					<ul
						id="querybar-suggestions"
						class="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-surface-elevated py-1 shadow-lg"
						role="listbox"
					>
						{#each suggestions as s, i (s.kind + s.value + (s.detail ?? '') + i)}
							<li role="option" aria-selected={i === highlight}>
								<button
									type="button"
									class={[
										'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
										i === highlight
											? 'bg-brand-500/10 text-primary'
											: 'text-secondary hover:bg-surface-overlay'
									]}
									onmousedown={(e) => {
										e.preventDefault();
										applySuggestion(s);
									}}
								>
									<span
										class={[
											'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase',
											kindBadge[s.kind]
										]}
									>
										{s.kind}
									</span>
									<span class="min-w-0 flex-1 truncate font-mono text-xs">{s.label}</span>
									{#if s.detail}
										<span class="truncate text-[11px] text-muted">{s.detail}</span>
									{/if}
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			{#if value}
				<button
					type="button"
					class="rounded-xl px-2 text-muted hover:bg-surface-overlay hover:text-primary"
					aria-label="Clear"
					onmousedown={(e) => {
						e.preventDefault();
						clear(e);
					}}
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}

			<button
				type="button"
				class={[
					'rounded-xl px-2 text-xs font-medium',
					showHelp ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'text-muted hover:bg-surface-overlay hover:text-primary'
				]}
				aria-pressed={showHelp}
				onclick={() => (showHelp = !showHelp)}
			>
				?
			</button>

			<Button variant="primary" size="sm" {disabled} onclick={submit} class="shrink-0">
				{submitLabel}
			</Button>
		</div>
	</div>

	{#if syntaxError}
		<p
			id="querybar-error"
			class="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
			role="alert"
		>
			<svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
			</svg>
			{syntaxError}
		</p>
	{/if}

	{#if showFieldChips && fields.length}
		<div class="flex flex-wrap items-center gap-1.5">
			<span class="text-[11px] font-medium text-muted">Fields</span>
			{#each fields as f (f.id)}
				<button
					type="button"
					class="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 font-mono text-[11px] text-secondary hover:border-brand-500/40 hover:text-primary"
					onclick={() => insertField(f.id)}
				>
					{f.id}
				</button>
			{/each}
		</div>
	{/if}

	{#if showExamples && examples.length}
		<div class="space-y-1.5">
			<p class="text-[11px] font-medium text-muted">Examples</p>
			<div class="flex flex-wrap gap-1.5">
				{#each examples as ex (ex.query)}
					<button
						type="button"
						class="rounded-lg border border-border bg-surface-overlay/50 px-2.5 py-1 text-left transition hover:border-brand-500/30 hover:bg-brand-500/5"
						title={ex.description}
						onclick={() => insertExample(ex)}
					>
						<span class="block text-[11px] font-medium text-primary">{ex.label}</span>
						<span class="block max-w-[14rem] truncate font-mono text-[10px] text-muted">{ex.query}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if showHelp}
		<div class="rounded-xl border border-border bg-surface-overlay/60 p-3 text-[11px] leading-relaxed text-secondary">
			<p class="mb-1 font-semibold text-primary">Query syntax</p>
			<ul class="list-inside list-disc space-y-0.5">
				<li><code class="text-sky-600 dark:text-sky-400">field:value</code> — equality filter</li>
				<li><code class="text-amber-600 dark:text-amber-400">price&gt;=100</code> — numeric compare</li>
				<li><code class="text-violet-600 dark:text-violet-400">AND</code> / <code class="text-violet-600 dark:text-violet-400">OR</code> / <code class="text-violet-600 dark:text-violet-400">NOT</code> — combine</li>
				<li><code class="text-orange-600 dark:text-orange-400">( … )</code> — group precedence</li>
				<li><code class="text-emerald-600 dark:text-emerald-400">name:"Air Zoom"</code> — quoted values</li>
				<li><code class="text-amber-600 dark:text-amber-400">name~boost</code> — contains (~)</li>
			</ul>
		</div>
	{/if}
</div>
