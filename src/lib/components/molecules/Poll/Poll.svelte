<script module lang="ts">
	export interface PollOption {
		id: string;
		label: string;
		description?: string;
		votes?: number;
		disabled?: boolean;
	}

	export type PollSize = 'sm' | 'md' | 'lg';
	export type PollLayout = 'list' | 'cards';
</script>

<script lang="ts">
	interface PollProps {
		question: string;
		description?: string;
		options?: PollOption[];
		/** Selected option id (single) or ids (multiple) */
		value?: string | string[] | null;
		totalVotes?: number;
		disabled?: boolean;
		/** Force results view */
		showResults?: boolean;
		/** Allow changing vote after selecting */
		allowChange?: boolean;
		multiple?: boolean;
		/** Max selections when multiple (0 = unlimited) */
		maxSelections?: number;
		showPercent?: boolean;
		showCounts?: boolean;
		sortByVotes?: boolean;
		size?: PollSize;
		layout?: PollLayout;
		hint?: string;
		class?: string;
		onchange?: (value: string | string[]) => void;
	}

	let {
		question,
		description,
		options = $bindable([] as PollOption[]),
		value = $bindable(null as string | string[] | null),
		totalVotes = $bindable(0),
		disabled = false,
		showResults = false,
		allowChange = false,
		multiple = false,
		maxSelections = 0,
		showPercent = true,
		showCounts = false,
		sortByVotes = false,
		size = 'md',
		layout = 'list',
		hint,
		class: className = '',
		onchange
	}: PollProps = $props();

	const selectedIds = $derived.by((): string[] => {
		if (value == null) return [];
		return Array.isArray(value) ? value : [value];
	});

	const hasVoted = $derived(selectedIds.length > 0);
	const locked = $derived(hasVoted && !allowChange && !multiple);
	const reveal = $derived(showResults || locked || (hasVoted && !multiple && allowChange));
	const total = $derived(
		totalVotes > 0 ? totalVotes : options.reduce((sum, o) => sum + (o.votes ?? 0), 0)
	);

	const displayOptions = $derived.by(() => {
		if (!(showResults || locked) || !sortByVotes) return options;
		return [...options].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
	});

	const pad = $derived(size === 'sm' ? 'p-3' : size === 'lg' ? 'p-5' : 'p-4');
	const qClass = $derived(size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm');
	const optClass = $derived(
		size === 'sm'
			? 'text-[11px] px-2.5 py-1.5'
			: size === 'lg'
				? 'text-sm px-3.5 py-2.5'
				: 'text-xs px-3 py-2'
	);

	function isSelected(id: string) {
		return selectedIds.includes(id);
	}

	function addVote(id: string) {
		options = options.map((o) =>
			o.id === id ? { ...o, votes: (o.votes ?? 0) + 1 } : o
		);
		totalVotes = total + 1;
	}

	function removeVote(id: string) {
		options = options.map((o) =>
			o.id === id ? { ...o, votes: Math.max(0, (o.votes ?? 0) - 1) } : o
		);
		totalVotes = Math.max(0, total - 1);
	}

	function vote(id: string) {
		if (disabled) return;
		const opt = options.find((o) => o.id === id);
		if (opt?.disabled) return;

		if (multiple) {
			const set = new Set(selectedIds);
			if (set.has(id)) {
				set.delete(id);
				removeVote(id);
				value = [...set];
				onchange?.(value);
				return;
			}
			if (maxSelections > 0 && set.size >= maxSelections) return;
			set.add(id);
			addVote(id);
			value = [...set];
			onchange?.(value);
			return;
		}

		if (locked) return;

		if (allowChange && selectedIds[0] && selectedIds[0] !== id) {
			removeVote(selectedIds[0]);
			addVote(id);
			value = id;
			onchange?.(id);
			return;
		}

		if (hasVoted) return;

		addVote(id);
		value = id;
		onchange?.(id);
	}

	function pct(votes: number) {
		if (!total) return 0;
		return Math.round((votes / total) * 100);
	}

	function meta(votes: number) {
		const parts: string[] = [];
		if (showPercent) parts.push(`${pct(votes)}%`);
		if (showCounts) parts.push(`${votes}`);
		return parts.join(' · ');
	}

	const showBars = $derived(showResults || locked || (hasVoted && allowChange && !multiple));
</script>

<div
	class={['rounded-xl border border-border bg-surface-elevated', pad, className]}
	role="group"
	aria-label={question}
>
	<div class="mb-3">
		<p class={['font-semibold text-primary', qClass]}>{question}</p>
		{#if description}
			<p class="mt-1 text-xs text-secondary">{description}</p>
		{/if}
		{#if multiple}
			<p class="mt-1 text-[11px] text-muted">
				Select {maxSelections > 0 ? `up to ${maxSelections}` : 'one or more'}
			</p>
		{/if}
	</div>

	<ul
		class={[
			'space-y-2',
			layout === 'cards' && 'sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0'
		]}
	>
		{#each displayOptions as option (option.id)}
			{@const votes = option.votes ?? 0}
			{@const selected = isSelected(option.id)}
			<li>
				{#if showBars}
					<button
						type="button"
						class={[
							'relative w-full overflow-hidden rounded-lg border text-left transition-colors',
							optClass,
							selected ? 'border-brand-500/50' : 'border-border',
							allowChange && !disabled && !option.disabled && 'hover:border-brand-500/40',
							(disabled || option.disabled || !allowChange) && 'cursor-default'
						]}
						disabled={disabled || option.disabled || !allowChange}
						aria-pressed={selected}
						onclick={() => allowChange && vote(option.id)}
					>
						<div
							class="absolute inset-y-0 left-0 bg-brand-500/15 transition-[width] duration-300 ease-out"
							style:width={`${pct(votes)}%`}
							aria-hidden="true"
						></div>
						<div class="relative flex items-start justify-between gap-2">
							<span class="min-w-0">
								<span
									class={[
										'block font-medium',
										selected ? 'text-brand-700 dark:text-brand-300' : 'text-primary'
									]}
								>
									{option.label}
								</span>
								{#if option.description}
									<span class="mt-0.5 block text-[11px] font-normal text-secondary">
										{option.description}
									</span>
								{/if}
							</span>
							{#if showPercent || showCounts}
								<span class="shrink-0 tabular-nums text-muted">{meta(votes)}</span>
							{/if}
						</div>
					</button>
				{:else}
					<button
						type="button"
						class={[
							'w-full rounded-lg border border-border text-left font-medium text-secondary transition-colors',
							'hover:border-brand-500/30 hover:bg-surface-overlay hover:text-primary',
							'disabled:cursor-not-allowed disabled:opacity-40',
							selected && 'border-brand-500/40 bg-brand-500/5 text-primary',
							optClass
						]}
						disabled={
							disabled ||
							option.disabled ||
							(multiple &&
								maxSelections > 0 &&
								selectedIds.length >= maxSelections &&
								!selected)
						}
						aria-pressed={selected}
						onclick={() => vote(option.id)}
					>
						<span class="block">{option.label}</span>
						{#if option.description}
							<span class="mt-0.5 block text-[11px] font-normal text-muted">
								{option.description}
							</span>
						{/if}
					</button>
				{/if}
			</li>
		{/each}
	</ul>

	<div class="mt-2.5 flex flex-wrap items-center justify-between gap-2">
		{#if showBars}
			<p class="text-[11px] text-muted">
				{total.toLocaleString()} vote{total === 1 ? '' : 's'}
			</p>
		{:else}
			<span></span>
		{/if}
		{#if hint}
			<p class="text-[11px] text-muted">{hint}</p>
		{/if}
	</div>
</div>
