<script lang="ts">
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import type {
		AdvancedFilterClause,
		AdvancedFilterValue,
		FilterOperator
	} from '$lib/utils/filterParams.js';

	export type FilterFieldType = 'text' | 'number' | 'select' | 'multiselect' | 'date';

	export interface FilterFieldDef {
		id: string;
		label: string;
		type: FilterFieldType;
		operators?: FilterOperator[];
		options?: { value: string; label: string }[];
	}

	interface AdvancedFiltersProps {
		fields?: FilterFieldDef[];
		clauses?: AdvancedFilterClause[];
		title?: string;
		addLabel?: string;
		applyLabel?: string;
		class?: string;
		onchange?: (clauses: AdvancedFilterClause[]) => void;
		onapply?: (clauses: AdvancedFilterClause[]) => void;
	}

	const DEFAULT_OPS: Record<FilterFieldType, FilterOperator[]> = {
		text: ['eq', 'neq', 'contains'],
		number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between'],
		select: ['eq', 'neq'],
		multiselect: ['in'],
		date: ['eq', 'gte', 'lte', 'between']
	};

	const OP_LABELS: Record<FilterOperator, string> = {
		eq: 'is',
		neq: 'is not',
		in: 'is one of',
		gt: '>',
		gte: '≥',
		lt: '<',
		lte: '≤',
		contains: 'contains',
		between: 'between'
	};

	let {
		fields = [],
		clauses = $bindable([] as AdvancedFilterClause[]),
		title = 'Advanced filters',
		addLabel = 'Add filter',
		applyLabel = 'Apply',
		class: className = '',
		onchange,
		onapply
	}: AdvancedFiltersProps = $props();

	let draftField = $state('');
	let draftOp = $state<FilterOperator>('eq');
	let draftValue = $state('');
	let draftValueTo = $state('');
	let draftMulti = $state<string[]>([]);

	const fieldDef = $derived(fields.find((f) => f.id === draftField));
	const operators = $derived(
		fieldDef?.operators ?? (fieldDef ? DEFAULT_OPS[fieldDef.type] : [])
	);

	const fieldOptions = $derived(fields.map((f) => ({ value: f.id, label: f.label })));
	const opOptions = $derived(operators.map((op) => ({ value: op, label: OP_LABELS[op] })));

	$effect(() => {
		if (!draftField && fields[0]) {
			draftField = fields[0].id;
		}
	});

	$effect(() => {
		if (fieldDef && !operators.includes(draftOp)) {
			draftOp = operators[0] ?? 'eq';
		}
	});

	function formatClauseLabel(clause: AdvancedFilterClause): string {
		const field = fields.find((f) => f.id === clause.field);
		const name = field?.label ?? clause.field;
		const op = OP_LABELS[clause.op] ?? clause.op;
		let val: string;
		if (Array.isArray(clause.value)) {
			val = clause.value.join(clause.op === 'between' ? ' – ' : ', ');
		} else {
			val = String(clause.value);
		}
		return `${name} ${op} ${val}`;
	}

	function buildValue(): AdvancedFilterValue | null {
		if (!fieldDef) return null;
		if (draftOp === 'between') {
			const a = Number(draftValue);
			const b = Number(draftValueTo);
			if (Number.isNaN(a) || Number.isNaN(b)) return null;
			return [a, b];
		}
		if (fieldDef.type === 'multiselect' || draftOp === 'in') {
			return draftMulti.length ? [...draftMulti] : null;
		}
		if (fieldDef.type === 'number') {
			const n = Number(draftValue);
			if (draftValue.trim() === '' || Number.isNaN(n)) return null;
			return String(n);
		}
		if (!draftValue.trim() && fieldDef.type !== 'select') return null;
		if (fieldDef.type === 'select' && !draftValue) return null;
		return draftValue.trim();
	}

	function addClause() {
		const value = buildValue();
		if (!fieldDef || value === null) return;
		const clause: AdvancedFilterClause = {
			id: `af-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
			field: fieldDef.id,
			op: draftOp,
			value
		};
		clauses = [...clauses, clause];
		draftValue = '';
		draftValueTo = '';
		draftMulti = [];
		onchange?.(clauses);
	}

	function removeClause(id: string) {
		clauses = clauses.filter((c) => c.id !== id);
		onchange?.(clauses);
	}

	function clearAll() {
		clauses = [];
		onchange?.(clauses);
	}

	function apply() {
		onapply?.(clauses);
	}

	function toggleMulti(optionValue: string) {
		draftMulti = draftMulti.includes(optionValue)
			? draftMulti.filter((v) => v !== optionValue)
			: [...draftMulti, optionValue];
	}
</script>

<div
	class={[
		'space-y-3 rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm',
		className
	]}
>
	<div class="flex items-center justify-between gap-2">
		<h3 class="text-sm font-semibold text-primary">{title}</h3>
		{#if clauses.length}
			<button
				type="button"
				class="text-xs font-medium text-muted hover:text-primary"
				onclick={clearAll}
			>
				Clear
			</button>
		{/if}
	</div>

	{#if clauses.length}
		<div class="flex flex-wrap gap-1.5">
			{#each clauses as clause (clause.id)}
				<Chip size="sm" dismissible ondismiss={() => removeClause(clause.id)}>
					{formatClauseLabel(clause)}
				</Chip>
			{/each}
		</div>
	{/if}

	<div class="grid gap-2 sm:grid-cols-[1.2fr_0.9fr_1.4fr_auto]">
		<Select
			label="Field"
			size="sm"
			placeholder="Field"
			options={fieldOptions}
			bind:value={draftField}
		/>
		<Select
			label="Operator"
			size="sm"
			placeholder="Operator"
			options={opOptions}
			value={draftOp}
			onchange={(v) => (draftOp = v as FilterOperator)}
		/>

		<div class="min-w-0">
			{#if fieldDef?.type === 'select'}
				<Select
					label="Value"
					size="sm"
					placeholder="Value"
					options={(fieldDef.options ?? []).map((o) => ({ value: o.value, label: o.label }))}
					bind:value={draftValue}
				/>
			{:else if fieldDef?.type === 'multiselect' || draftOp === 'in'}
				<div class="space-y-1">
					<p class="text-xs font-medium text-secondary">Value</p>
					<div class="flex max-h-28 flex-wrap gap-1 overflow-auto rounded-lg border border-border p-2">
						{#each fieldDef?.options ?? [] as opt (opt.value)}
							<button
								type="button"
								class={[
									'rounded-full border px-2 py-0.5 text-[11px] font-medium',
									draftMulti.includes(opt.value)
										? 'border-brand-500/40 bg-brand-500/10 text-brand-700 dark:text-brand-300'
										: 'border-border text-secondary hover:bg-surface-overlay'
								]}
								onclick={() => toggleMulti(opt.value)}
							>
								{opt.label}
							</button>
						{/each}
					</div>
				</div>
			{:else if draftOp === 'between'}
				<div class="grid grid-cols-2 gap-2">
					<Input label="From" size="sm" type="number" bind:value={draftValue} />
					<Input label="To" size="sm" type="number" bind:value={draftValueTo} />
				</div>
			{:else}
				<Input
					label="Value"
					size="sm"
					type={fieldDef?.type === 'number' ? 'number' : fieldDef?.type === 'date' ? 'text' : 'text'}
					placeholder={fieldDef?.type === 'date' ? 'YYYY-MM-DD' : 'Value'}
					bind:value={draftValue}
				/>
			{/if}
		</div>

		<div class="flex items-end">
			<Button variant="secondary" size="sm" onclick={addClause}>{addLabel}</Button>
		</div>
	</div>

	{#if onapply}
		<div class="flex justify-end">
			<Button variant="primary" size="sm" onclick={apply}>{applyLabel}</Button>
		</div>
	{/if}
</div>
