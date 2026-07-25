<script lang="ts">
	export interface PollOption {
		id: string;
		label: string;
		votes?: number;
	}

	interface PollProps {
		question: string;
		options?: PollOption[];
		value?: string | null;
		totalVotes?: number;
		disabled?: boolean;
		showResults?: boolean;
		class?: string;
		onchange?: (optionId: string) => void;
	}

	let {
		question,
		options = $bindable([] as PollOption[]),
		value = $bindable(null as string | null),
		totalVotes = $bindable(0),
		disabled = false,
		showResults = false,
		class: className = '',
		onchange
	}: PollProps = $props();

	const reveal = $derived(showResults || value !== null);
	const total = $derived(
		totalVotes || options.reduce((sum, o) => sum + (o.votes ?? 0), 0)
	);

	function vote(id: string) {
		if (disabled || value) return;
		options = options.map((o) =>
			o.id === id ? { ...o, votes: (o.votes ?? 0) + 1 } : o
		);
		totalVotes = total + 1;
		value = id;
		onchange?.(id);
	}

	function pct(votes: number) {
		if (!total) return 0;
		return Math.round((votes / total) * 100);
	}
</script>

<div
	class={['rounded-xl border border-border bg-surface-elevated p-4', className]}
	role="group"
	aria-label={question}
>
	<p class="mb-3 text-sm font-semibold text-primary">{question}</p>
	<ul class="space-y-2">
		{#each options as option (option.id)}
			{@const votes = option.votes ?? 0}
			{@const selected = value === option.id}
			<li>
				{#if reveal}
					<div
						class={[
							'relative overflow-hidden rounded-lg border px-3 py-2',
							selected ? 'border-brand-500/40' : 'border-border'
						]}
					>
						<div
							class="absolute inset-y-0 left-0 bg-brand-500/10"
							style:width={`${pct(votes)}%`}
							aria-hidden="true"
						></div>
						<div class="relative flex items-center justify-between gap-2 text-xs">
							<span class={['font-medium', selected ? 'text-brand-700 dark:text-brand-300' : 'text-primary']}>
								{option.label}
							</span>
							<span class="tabular-nums text-muted">{pct(votes)}%</span>
						</div>
					</div>
				{:else}
					<button
						type="button"
						class="w-full rounded-lg border border-border px-3 py-2 text-left text-xs font-medium text-secondary transition-colors hover:border-brand-500/30 hover:bg-surface-overlay hover:text-primary disabled:opacity-40"
						{disabled}
						onclick={() => vote(option.id)}
					>
						{option.label}
					</button>
				{/if}
			</li>
		{/each}
	</ul>
	{#if reveal}
		<p class="mt-2 text-[11px] text-muted">{total} vote{total === 1 ? '' : 's'}</p>
	{/if}
</div>
