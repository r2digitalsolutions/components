<script lang="ts">
	import { on } from 'svelte/events';
	import { createId } from '$lib/utils/id.js';

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
		/** Character that opens mentions. Default `@`. Ignored when `triggers` is set. */
		trigger?: string;
		/** Several openers in one field, e.g. `['@', '#']`. */
		triggers?: string[];
		/**
		 * Suggestions per opener. When omitted, `suggestions` is used for every trigger
		 * (single-trigger fields stay as they were).
		 */
		suggestionsByTrigger?: Record<string, MentionSuggestion[]>;
		/** Max suggestions shown. */
		maxSuggestions?: number;
		/** Preferred side of the @ or #. The list flips if there is no room. */
		placement?: 'top' | 'bottom';
		class?: string;
		onquery?: (detail: { trigger: string; query: string }) => void;
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
		triggers,
		suggestionsByTrigger,
		maxSuggestions = 8,
		placement = 'top',
		class: className = '',
		onquery,
		onselect,
		onchange
	}: MentionInputProps = $props();

	let open = $state(false);
	let query = $state('');
	let caret = $state(0);
	/** Index of the `@` or `#` that opened the list. */
	let anchorIndex = $state(0);
	let activeIndex = $state(0);
	let activeTrigger = $state('');
	let textareaEl = $state<HTMLTextAreaElement | null>(null);
	let listEl = $state<HTMLUListElement | null>(null);
	let popoverEl = $state<HTMLDivElement | null>(null);
	let fieldId = $state('');
	let listId = $state('');

	const triggerList = $derived(triggers?.length ? triggers : [trigger]);
	const currentTrigger = $derived(activeTrigger || triggerList[0] || '@');
	const pool = $derived(
		suggestionsByTrigger ? (suggestionsByTrigger[currentTrigger] ?? []) : suggestions
	);

	const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	const filtered = $derived.by(() => {
		const q = query.toLowerCase();
		return pool
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

	$effect(() => {
		fieldId ||= createId('mention-input');
		listId ||= createId('mention-list');
	});

	function detectMention(text: string, pos: number) {
		const before = text.slice(0, pos);
		let best: { trigger: string; query: string; start: number } | null = null;
		for (const opener of triggerList) {
			const others = triggerList
				.filter((item) => item !== opener)
				.map(escapeRegExp)
				.join('');
			const re = new RegExp(`${escapeRegExp(opener)}([^\\s${others}]*)$`);
			const match = before.match(re);
			if (!match) continue;
			const candidate = {
				trigger: opener,
				query: match[1] ?? '',
				start: match.index ?? 0
			};
			if (!best || candidate.start >= best.start) best = candidate;
		}
		return best;
	}

	function syncFromCaret(text: string, pos: number) {
		const mention = detectMention(text, pos);
		if (mention) {
			const changed = mention.query !== query || mention.trigger !== activeTrigger || !open;
			query = mention.query;
			activeTrigger = mention.trigger;
			anchorIndex = mention.start;
			open = true;
			if (changed) activeIndex = 0;
			onquery?.({ trigger: mention.trigger, query: mention.query });
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
		const re = new RegExp(`${escapeRegExp(currentTrigger)}[^\\s]*$`);
		const replaced = before.replace(re, `${currentTrigger}${item.label} `);
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
		if (activeIndex >= filtered.length) {
			activeIndex = Math.max(0, filtered.length - 1);
		}
	});

	const MIRROR_PROPS = [
		'direction',
		'boxSizing',
		'width',
		'overflowX',
		'overflowY',
		'borderTopWidth',
		'borderRightWidth',
		'borderBottomWidth',
		'borderLeftWidth',
		'borderStyle',
		'paddingTop',
		'paddingRight',
		'paddingBottom',
		'paddingLeft',
		'fontStyle',
		'fontVariant',
		'fontWeight',
		'fontStretch',
		'fontSize',
		'fontFamily',
		'lineHeight',
		'letterSpacing',
		'textAlign',
		'textTransform',
		'textIndent',
		'wordSpacing',
		'tabSize'
	] as const;

	/** Viewport box of the character at `index` inside a textarea. */
	function caretBox(textarea: HTMLTextAreaElement, index: number, text: string) {
		const computed = getComputedStyle(textarea);
		const mirror = document.createElement('div');
		const mirrorStyle = mirror.style;
		mirrorStyle.position = 'absolute';
		mirrorStyle.visibility = 'hidden';
		mirrorStyle.whiteSpace = 'pre-wrap';
		mirrorStyle.overflowWrap = 'break-word';
		mirrorStyle.top = '0';
		mirrorStyle.left = '0';
		mirrorStyle.pointerEvents = 'none';

		for (const prop of MIRROR_PROPS) {
			mirrorStyle[prop] = computed[prop];
		}
		mirrorStyle.whiteSpace = 'pre-wrap';
		mirrorStyle.overflow = 'hidden';

		const safeIndex = Math.max(0, Math.min(index, text.length));
		mirror.textContent = text.slice(0, safeIndex);
		const marker = document.createElement('span');
		marker.textContent = text.slice(safeIndex, safeIndex + 1) || '.';
		mirror.appendChild(marker);
		document.body.appendChild(mirror);

		const borderTop = parseFloat(computed.borderTopWidth) || 0;
		const borderLeft = parseFloat(computed.borderLeftWidth) || 0;
		const lineHeight = marker.offsetHeight || parseFloat(computed.lineHeight) || 20;
		const localTop = marker.offsetTop + borderTop;
		const localLeft = marker.offsetLeft + borderLeft;
		mirror.remove();

		const rect = textarea.getBoundingClientRect();
		return {
			top: rect.top + localTop - textarea.scrollTop,
			left: rect.left + localLeft - textarea.scrollLeft,
			lineHeight,
			field: rect
		};
	}

	function placePopover() {
		if (!textareaEl || !popoverEl) return;
		const index = anchorIndex;
		const text = value;
		const rect = textareaEl.getBoundingClientRect();
		if (rect.width < 2) return;

		const gap = 6;
		const margin = 8;
		const point = caretBox(textareaEl, index, text);
		const fieldStyle = getComputedStyle(textareaEl);
		const borderTop = parseFloat(fieldStyle.borderTopWidth) || 0;
		const borderBottom = parseFloat(fieldStyle.borderBottomWidth) || 0;
		const borderLeft = parseFloat(fieldStyle.borderLeftWidth) || 0;
		const borderRight = parseFloat(fieldStyle.borderRightWidth) || 0;
		const visibleTop = rect.top + borderTop;
		const visibleBottom = rect.bottom - borderBottom;
		const visibleLeft = rect.left + borderLeft;
		const visibleRight = rect.right - borderRight;

		let lineTop = point.top;
		let lineBottom = point.top + point.lineHeight;
		if (lineBottom < visibleTop) {
			lineTop = visibleTop;
			lineBottom = visibleTop;
		} else if (lineTop > visibleBottom) {
			lineTop = visibleBottom;
			lineBottom = visibleBottom;
		}

		let anchorLeft = point.left;
		if (anchorLeft < visibleLeft) anchorLeft = visibleLeft;
		if (anchorLeft > visibleRight - 12) anchorLeft = Math.max(visibleLeft, visibleRight - 12);

		const width = Math.min(320, rect.width, window.innerWidth - margin * 2);
		const maxLeft = window.innerWidth - margin - width;
		const left = Math.min(Math.max(margin, anchorLeft), Math.max(margin, maxLeft));

		const spaceBelow = window.innerHeight - lineBottom - gap - margin;
		const spaceAbove = lineTop - gap - margin;
		const openUp =
			placement === 'top' ? spaceAbove > 80 : spaceBelow < 120 && spaceAbove > spaceBelow;
		const height = Math.min(256, Math.max(72, openUp ? spaceAbove : spaceBelow));

		popoverEl.style.width = `${width}px`;
		popoverEl.style.maxHeight = `${height}px`;
		popoverEl.style.left = `${left}px`;
		const used = Math.min(popoverEl.offsetHeight || height, height);
		popoverEl.style.top = openUp
			? `${Math.max(margin, lineTop - gap - used)}px`
			: `${lineBottom + gap}px`;
	}

	$effect(() => {
		const el = popoverEl;
		const visible = showList && (filtered.length > 0 || query.length > 0);
		if (!el) return;
		if (visible) {
			if (!el.matches(':popover-open')) el.showPopover();
			placePopover();
		} else if (el.matches(':popover-open')) {
			el.hidePopover();
		}
	});

	$effect(() => {
		if (!showList) return;
		const field = textareaEl;
		const offResize = on(window, 'resize', () => placePopover());
		const offScroll = on(window, 'scroll', () => placePopover(), { capture: true });
		const offFieldScroll = field ? on(field, 'scroll', () => placePopover()) : () => {};
		const observer = field ? new ResizeObserver(() => placePopover()) : null;
		if (field) observer?.observe(field);
		const offPointer = on(window, 'pointerdown', (event) => {
			const target = event.target as Node | null;
			if (textareaEl?.contains(target) || popoverEl?.contains(target)) return;
			open = false;
		});
		return () => {
			offResize();
			offScroll();
			offFieldScroll();
			observer?.disconnect();
			offPointer();
		};
	});
</script>

<div class={['gap-1.5 flex w-full flex-col', className]}>
	{#if label}
		<label class="text-sm font-medium text-primary" for={fieldId}>{label}</label>
	{/if}

	<div>
		<textarea
			bind:this={textareaEl}
			id={fieldId}
			class={[
				'rounded-xl border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-primary shadow-sm w-full resize-y border',
				'placeholder:text-muted transition outline-none',
				'focus:border-brand-500 focus:ring-brand-500/20 focus:ring-2',
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
			}}></textarea>

		<div
			bind:this={popoverEl}
			popover="manual"
			class="mention-popover rounded-xl border-border bg-surface-elevated shadow-xl overflow-auto border outline-none"
		>
			{#if showList && filtered.length}
				<ul bind:this={listEl} id={listId} class="py-1.5" role="listbox" aria-label="Suggestions">
					<li class="px-3 pb-1.5 pt-1 font-medium tracking-wide text-muted text-[10px] uppercase">
						{currentTrigger === '#' ? 'Hashtags' : 'Mentions'}
						{#if query}
							<span class="tracking-normal text-secondary normal-case">
								· {currentTrigger}{query}</span
							>
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
									'gap-3 px-3 py-2 flex w-full items-center text-left transition-colors',
									active ? 'bg-brand-50 dark:bg-brand-950/40' : 'hover:bg-surface-overlay'
								]}
								onmousedown={(e) => e.preventDefault()}
								onclick={() => insert(item)}
								onmouseenter={() => (activeIndex = i)}
							>
								{#if item.avatar}
									<img
										src={item.avatar}
										alt=""
										class="h-8 w-8 ring-border shrink-0 rounded-full object-cover ring-1"
									/>
								{:else}
									<span
										class={[
											'h-8 w-8 font-semibold flex shrink-0 items-center justify-center rounded-full text-[11px]',
											active ? 'bg-brand-500 text-white' : 'bg-surface-overlay text-secondary'
										]}
									>
										{initials(item.label)}
									</span>
								{/if}

								<span class="min-w-0 flex-1">
									<span class="text-sm font-medium text-primary block truncate">
										{currentTrigger}{#each highlight(item.label, query) as part, index (index)}
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
										<span class="text-xs text-muted block truncate">
											{item.description ?? item.meta}
										</span>
									{/if}
								</span>

								{#if active}
									<span class="font-medium text-muted sm:inline hidden shrink-0 text-[10px]">
										↵
									</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			{:else if showList && query}
				<div class="px-3 py-3 text-sm text-muted text-center" role="status">
					No matches for “{query}”
				</div>
			{/if}
		</div>
	</div>

	{#if helperText}
		<p class="text-xs text-muted">{helperText}</p>
	{:else}
		<p class="text-muted text-[11px]">
			<span class="font-medium text-secondary">{triggerList.join(' ')}</span> to insert ·
			<kbd class="rounded border-border bg-surface px-1 py-0.5 font-mono border text-[10px]">↑</kbd>
			<kbd class="rounded border-border bg-surface px-1 py-0.5 font-mono border text-[10px]">↓</kbd>
			navigate ·
			<kbd class="rounded border-border bg-surface px-1 py-0.5 font-mono border text-[10px]"
				>Enter</kbd
			>
			select ·
			<kbd class="rounded border-border bg-surface px-1 py-0.5 font-mono border text-[10px]"
				>Esc</kbd
			>
			close
		</p>
	{/if}
</div>

<style>
	.mention-popover {
		position: fixed;
		inset: unset;
		margin: 0;
		width: max-content;
		height: max-content;
	}

	.mention-popover:popover-open {
		display: block;
	}

	.mention-popover:not(:popover-open) {
		display: none;
	}
</style>
