<script lang="ts">
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import {
		OP_LABELS,
		asFilterGroup,
		countRules,
		emptyFilterGroup,
		emptyFilterRule,
		flattenRules,
		formatRuleLabel,
		operatorsForField,
		resolveValueKind,
		type AdvancedFilterClause,
		type AdvancedFilterGroup,
		type AdvancedFilterNode,
		type AdvancedFilterRule,
		type AdvancedFilterValue,
		type FilterCombinator,
		type FilterFieldDef,
		type FilterFieldType,
		type FilterOperator
	} from '$lib/utils/advancedFilters.js';

	export type { FilterFieldDef, FilterFieldType };

	interface AdvancedFiltersProps {
		fields?: FilterFieldDef[];
		/** Preferred: full query tree with AND/OR groups */
		query?: AdvancedFilterGroup;
		/** @deprecated Prefer `query` */
		clauses?: AdvancedFilterClause[];
		title?: string;
		class?: string;
		onchange?: (query: AdvancedFilterGroup) => void;
		onapply?: (query: AdvancedFilterGroup) => void;
		/** @deprecated */
		onclauses?: (clauses: AdvancedFilterClause[]) => void;
		applyLabel?: string;
	}

	let {
		fields = [],
		query = $bindable(emptyFilterGroup()),
		clauses = $bindable([] as AdvancedFilterClause[]),
		title = 'Advanced filters',
		class: className = '',
		onchange,
		onapply,
		onclauses,
		applyLabel = 'Apply'
	}: AdvancedFiltersProps = $props();

	// Sync legacy clauses → query once when parent only passes clauses
	let syncedFromClauses = $state(false);
	$effect(() => {
		if (syncedFromClauses) return;
		if (clauses.length && !countRules(query)) {
			query = asFilterGroup(clauses);
			syncedFromClauses = true;
		}
	});

	function emit(next: AdvancedFilterGroup) {
		query = next;
		const flat = flattenRules(next).map((r) => ({
			id: r.id,
			field: r.field,
			op: r.op,
			value: r.value
		}));
		clauses = flat;
		onchange?.(next);
		onclauses?.(flat);
	}

	function patchRoot(mutator: (root: AdvancedFilterGroup) => AdvancedFilterGroup) {
		emit(mutator(JSON.parse(JSON.stringify(query)) as AdvancedFilterGroup));
	}

	function updateNode(
		root: AdvancedFilterGroup,
		id: string,
		updater: (n: AdvancedFilterNode) => AdvancedFilterNode
	): AdvancedFilterGroup {
		function walk(node: AdvancedFilterNode): AdvancedFilterNode {
			if (node.id === id) return updater(node);
			if (node.type === 'group') {
				return { ...node, rules: node.rules.map(walk) };
			}
			return node;
		}
		return walk(root) as AdvancedFilterGroup;
	}

	function removeNode(root: AdvancedFilterGroup, id: string): AdvancedFilterGroup {
		function walk(node: AdvancedFilterGroup): AdvancedFilterGroup {
			return {
				...node,
				rules: node.rules
					.filter((r) => r.id !== id)
					.map((r) => (r.type === 'group' ? walk(r) : r))
			};
		}
		return walk(root);
	}

	function addRuleTo(groupId: string) {
		const fieldId = fields[0]?.id ?? '';
		const op = fields[0] ? operatorsForField(fields[0])[0] : 'eq';
		patchRoot((root) =>
			updateNode(root, groupId, (n) => {
				if (n.type !== 'group') return n;
				return { ...n, rules: [...n.rules, emptyFilterRule(fieldId, op)] };
			})
		);
	}

	function addGroupTo(groupId: string) {
		patchRoot((root) =>
			updateNode(root, groupId, (n) => {
				if (n.type !== 'group') return n;
				const child = emptyFilterGroup(n.combinator === 'and' ? 'or' : 'and');
				child.rules = [emptyFilterRule(fields[0]?.id ?? '', 'eq')];
				return { ...n, rules: [...n.rules, child] };
			})
		);
	}

	function setCombinator(groupId: string, combinator: FilterCombinator) {
		patchRoot((root) =>
			updateNode(root, groupId, (n) => (n.type === 'group' ? { ...n, combinator } : n))
		);
	}

	function updateRule(ruleId: string, patch: Partial<AdvancedFilterRule>) {
		patchRoot((root) =>
			updateNode(root, ruleId, (n) => (n.type === 'rule' ? { ...n, ...patch } : n))
		);
	}

	function onFieldChange(rule: AdvancedFilterRule, fieldId: string) {
		const field = fields.find((f) => f.id === fieldId);
		const ops = field ? operatorsForField(field) : (['eq'] as FilterOperator[]);
		const op = ops.includes(rule.op) ? rule.op : ops[0];
		updateRule(rule.id, { field: fieldId, op, value: defaultValueFor(field, op) });
	}

	function onOpChange(rule: AdvancedFilterRule, op: FilterOperator) {
		const field = fields.find((f) => f.id === rule.field);
		updateRule(rule.id, { op, value: defaultValueFor(field, op) });
	}

	function defaultValueFor(
		field: FilterFieldDef | undefined,
		op: FilterOperator
	): AdvancedFilterValue {
		if (!field) return null;
		const kind = resolveValueKind(field, op);
		if (kind === 'none') return null;
		if (kind === 'multiselect') return [];
		if (kind === 'boolean') return true;
		if (kind === 'range-number') return [0, 100];
		if (kind === 'range-date') return ['', ''];
		if (kind === 'number') return '';
		return '';
	}

	function clearAll() {
		emit(emptyFilterGroup());
	}

	function apply() {
		onapply?.(query);
	}

	const fieldOptions = $derived(fields.map((f) => ({ value: f.id, label: f.label })));
	const ruleCount = $derived(countRules(query));
	const chips = $derived(flattenRules(query));

	function asString(v: AdvancedFilterValue): string {
		if (v === null || v === undefined) return '';
		if (typeof v === 'boolean') return v ? 'true' : 'false';
		if (Array.isArray(v)) return '';
		return String(v);
	}

	function asStringList(v: AdvancedFilterValue): string[] {
		return Array.isArray(v) && v.every((x) => typeof x === 'string') ? (v as string[]) : [];
	}

	function asRangeStrings(v: AdvancedFilterValue): [string, string] {
		if (Array.isArray(v) && v.length === 2) return [String(v[0] ?? ''), String(v[1] ?? '')];
		return ['', ''];
	}

	function toggleMulti(rule: AdvancedFilterRule, optionValue: string) {
		const list = asStringList(rule.value);
		const next = list.includes(optionValue)
			? list.filter((x) => x !== optionValue)
			: [...list, optionValue];
		updateRule(rule.id, { value: next });
	}
</script>

{#snippet valueEditor(rule: AdvancedFilterRule)}
	{@const field = fields.find((f) => f.id === rule.field)}
	{@const kind = field ? resolveValueKind(field, rule.op) : 'text'}

	{#if kind === 'none'}
		<p class="flex h-9 items-center text-xs text-muted">No value needed</p>
	{:else if kind === 'select'}
		<Select
			label="Value"
			size="sm"
			placeholder="Value"
			options={(field?.options ?? []).map((o) => ({ value: o.value, label: o.label }))}
			value={asString(rule.value)}
			onchange={(v) => updateRule(rule.id, { value: v })}
		/>
	{:else if kind === 'multiselect'}
		<div class="space-y-1">
			<p class="text-xs font-medium text-secondary">Value</p>
			<div class="flex max-h-24 flex-wrap gap-1 overflow-auto rounded-lg border border-border p-1.5">
				{#each field?.options ?? [] as opt (opt.value)}
					<button
						type="button"
						class={[
							'rounded-full border px-2 py-0.5 text-[11px] font-medium',
							asStringList(rule.value).includes(opt.value)
								? 'border-brand-500/40 bg-brand-500/10 text-brand-700 dark:text-brand-300'
								: 'border-border text-secondary hover:bg-surface-overlay'
						]}
						onclick={() => toggleMulti(rule, opt.value)}
					>
						{opt.label}
					</button>
				{/each}
				{#if !(field?.options?.length)}
					<Input
						size="sm"
						placeholder="a,b,c"
						value={asStringList(rule.value).join(',')}
						oninput={(e) =>
							updateRule(rule.id, {
								value: (e.currentTarget as HTMLInputElement).value
									.split(',')
									.map((s) => s.trim())
									.filter(Boolean)
							})}
					/>
				{/if}
			</div>
		</div>
	{:else if kind === 'boolean'}
		<Select
			label="Value"
			size="sm"
			options={[
				{ value: 'true', label: 'True' },
				{ value: 'false', label: 'False' }
			]}
			value={rule.value === true || rule.value === 'true' || rule.value === '1' ? 'true' : 'false'}
			onchange={(v) => updateRule(rule.id, { value: v === 'true' })}
		/>
	{:else if kind === 'range-number'}
		{@const range = asRangeStrings(rule.value)}
		<div class="grid grid-cols-2 gap-2">
			<Input
				label="From"
				size="sm"
				type="number"
				value={range[0]}
				oninput={(e) => {
					const a = Number((e.currentTarget as HTMLInputElement).value);
					const b = Number(range[1]);
					updateRule(rule.id, { value: [a, Number.isNaN(b) ? a : b] });
				}}
			/>
			<Input
				label="To"
				size="sm"
				type="number"
				value={range[1]}
				oninput={(e) => {
					const b = Number((e.currentTarget as HTMLInputElement).value);
					const a = Number(range[0]);
					updateRule(rule.id, { value: [Number.isNaN(a) ? b : a, b] });
				}}
			/>
		</div>
	{:else if kind === 'range-date'}
		{@const range = asRangeStrings(rule.value)}
		<div class="grid grid-cols-2 gap-2">
			<label class="space-y-1">
				<span class="text-xs font-medium text-secondary">From</span>
				<input
					type="date"
					class="w-full rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-sm text-primary"
					value={range[0]}
					onchange={(e) =>
						updateRule(rule.id, {
							value: [(e.currentTarget as HTMLInputElement).value, range[1]]
						})}
				/>
			</label>
			<label class="space-y-1">
				<span class="text-xs font-medium text-secondary">To</span>
				<input
					type="date"
					class="w-full rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-sm text-primary"
					value={range[1]}
					onchange={(e) =>
						updateRule(rule.id, {
							value: [range[0], (e.currentTarget as HTMLInputElement).value]
						})}
				/>
			</label>
		</div>
	{:else if kind === 'date'}
		<label class="space-y-1">
			<span class="text-xs font-medium text-secondary">Value</span>
			<input
				type="date"
				class="w-full rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-sm text-primary"
				value={asString(rule.value)}
				onchange={(e) =>
					updateRule(rule.id, { value: (e.currentTarget as HTMLInputElement).value })}
			/>
		</label>
	{:else if kind === 'number'}
		<Input
			label="Value"
			size="sm"
			type="number"
			value={asString(rule.value)}
			oninput={(e) =>
				updateRule(rule.id, { value: (e.currentTarget as HTMLInputElement).value })}
		/>
	{:else}
		<Input
			label="Value"
			size="sm"
			type="text"
			placeholder="Value"
			value={asString(rule.value)}
			oninput={(e) =>
				updateRule(rule.id, { value: (e.currentTarget as HTMLInputElement).value })}
		/>
	{/if}
{/snippet}

{#snippet groupEditor(group: AdvancedFilterGroup, depth: number)}
	<div
		class={[
			'space-y-2 rounded-xl border p-3',
			depth === 0 ? 'border-border bg-surface-overlay/40' : 'border-border/80 bg-surface-elevated'
		]}
	>
		<div class="flex flex-wrap items-center gap-2">
			<div class="inline-flex rounded-lg border border-border p-0.5">
				<button
					type="button"
					class={[
						'rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
						group.combinator === 'and'
							? 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
							: 'text-muted hover:text-primary'
					]}
					onclick={() => setCombinator(group.id, 'and')}
				>
					AND
				</button>
				<button
					type="button"
					class={[
						'rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
						group.combinator === 'or'
							? 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
							: 'text-muted hover:text-primary'
					]}
					onclick={() => setCombinator(group.id, 'or')}
				>
					OR
				</button>
			</div>
			<span class="text-[11px] text-muted">
				Match {group.combinator === 'and' ? 'all' : 'any'} of the following
			</span>
			<div class="ml-auto flex flex-wrap gap-1.5">
				<Button variant="ghost" size="xs" onclick={() => addRuleTo(group.id)}>+ Rule</Button>
				<Button variant="ghost" size="xs" onclick={() => addGroupTo(group.id)}>+ Group</Button>
				{#if depth > 0}
					<Button
						variant="ghost"
						size="xs"
						onclick={() => patchRoot((root) => removeNode(root, group.id))}
					>
						Remove
					</Button>
				{/if}
			</div>
		</div>

		{#if !group.rules.length}
			<p class="py-2 text-center text-xs text-muted">No rules yet — add a rule or group.</p>
		{/if}

		{#each group.rules as node, i (node.id)}
			{#if i > 0}
				<p class="text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
					{group.combinator}
				</p>
			{/if}

			{#if node.type === 'group'}
				{@render groupEditor(node, depth + 1)}
			{:else}
				{@const field = fields.find((f) => f.id === node.field)}
				{@const ops = field ? operatorsForField(field) : (['eq'] as FilterOperator[])}
				<div
					class="grid gap-2 rounded-lg border border-border bg-surface-elevated p-2 sm:grid-cols-[1.1fr_0.9fr_1.4fr_auto]"
				>
					<Select
						label="Field"
						size="sm"
						placeholder="Field"
						options={fieldOptions}
						value={node.field}
						onchange={(v) => onFieldChange(node, v)}
					/>
					<Select
						label="Operator"
						size="sm"
						placeholder="Operator"
						options={ops.map((op) => ({ value: op, label: OP_LABELS[op] }))}
						value={node.op}
						onchange={(v) => onOpChange(node, v as FilterOperator)}
					/>
					<div class="min-w-0">
						{@render valueEditor(node)}
					</div>
					<div class="flex items-end justify-end">
						<button
							type="button"
							class="rounded-lg p-2 text-muted hover:bg-surface-overlay hover:text-primary"
							aria-label="Remove rule"
							onclick={() => patchRoot((root) => removeNode(root, node.id))}
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/snippet}

<div
	class={[
		'space-y-3 rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm',
		className
	]}
>
	<div class="flex items-center justify-between gap-2">
		<div>
			<h3 class="text-sm font-semibold text-primary">{title}</h3>
			<p class="text-[11px] text-muted">
				{ruleCount} rule{ruleCount === 1 ? '' : 's'} · nest groups with AND / OR
			</p>
		</div>
		{#if ruleCount}
			<button
				type="button"
				class="text-xs font-medium text-muted hover:text-primary"
				onclick={clearAll}
			>
				Clear
			</button>
		{/if}
	</div>

	{#if chips.length}
		<div class="flex flex-wrap gap-1.5">
			{#each chips as rule (rule.id)}
				<Chip
					size="sm"
					dismissible
					ondismiss={() => patchRoot((root) => removeNode(root, rule.id))}
				>
					{formatRuleLabel(rule, fields)}
				</Chip>
			{/each}
		</div>
	{/if}

	{@render groupEditor(query, 0)}

	{#if onapply}
		<div class="flex justify-end">
			<Button variant="primary" size="sm" onclick={apply}>{applyLabel}</Button>
		</div>
	{/if}
</div>
