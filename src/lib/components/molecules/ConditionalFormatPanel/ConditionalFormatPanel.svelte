<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';
	import ColorSwatch from '$lib/components/atoms/ColorSwatch/ColorSwatch.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import ColorPicker from '$lib/components/molecules/ColorPicker/ColorPicker.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import type {
		ConditionalFormatRule,
		FormatCondition,
		FormatTarget
	} from '$lib/components/organisms/DataGrid/types.js';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Palette from '@lucide/svelte/icons/palette';

	interface ColumnOption {
		id: string;
		label: string;
	}

	interface ConditionalFormatPanelProps {
		rules?: ConditionalFormatRule[];
		columns?: ColumnOption[];
		class?: string;
		onchange?: (rules: ConditionalFormatRule[]) => void;
	}

	let {
		rules = $bindable<ConditionalFormatRule[]>([]),
		columns = [],
		class: className = '',
		onchange
	}: ConditionalFormatPanelProps = $props();

	let editingId = $state<string | null>(null);
	let draftName = $state('');
	let draftTarget = $state<string>('row');
	let draftColumnId = $state('');
	let draftOp = $state<string>('eq');
	let draftValue = $state('');
	let draftMin = $state('0');
	let draftMax = $state('100');
	let draftBg = $state('#fef3c7');
	let draftFg = $state('#92400e');

	const isEditing = $derived(editingId !== null);

	const targetOptions = [
		{ value: 'row', label: 'Entire row' },
		{ value: 'cell', label: 'Cell only' }
	];

	const ops = [
		{ value: 'eq', label: 'Equals' },
		{ value: 'neq', label: 'Not equals' },
		{ value: 'gt', label: 'Greater than' },
		{ value: 'gte', label: '≥ Greater or equal' },
		{ value: 'lt', label: 'Less than' },
		{ value: 'lte', label: '≤ Less or equal' },
		{ value: 'contains', label: 'Contains' },
		{ value: 'startsWith', label: 'Starts with' },
		{ value: 'empty', label: 'Is empty' },
		{ value: 'notEmpty', label: 'Is not empty' },
		{ value: 'between', label: 'Between' }
	];

	const columnOptions = $derived(columns.map((c) => ({ value: c.id, label: c.label })));

	const formatSwatches = [
		'#fef3c7',
		'#92400e',
		'#fee2e2',
		'#991b1b',
		'#dcfce7',
		'#166534',
		'#dbeafe',
		'#1e40af',
		'#f3e8ff',
		'#6b21a8',
		'#f1f5f9',
		'#0f172a'
	];

	$effect(() => {
		if (!draftColumnId && columns[0]) draftColumnId = columns[0].id;
	});

	function emit(next: ConditionalFormatRule[]) {
		rules = next;
		onchange?.(next);
	}

	function buildWhen(): FormatCondition | null {
		const columnId = draftColumnId || columns[0]?.id;
		if (!columnId) return null;
		const op = draftOp as FormatCondition['op'];
		if (op === 'empty' || op === 'notEmpty') return { op, columnId };
		if (op === 'between') {
			return { op: 'between', columnId, min: Number(draftMin), max: Number(draftMax) };
		}
		if (op === 'contains' || op === 'startsWith') {
			return { op, columnId, value: draftValue };
		}
		const num = Number(draftValue);
		const value =
			draftValue !== '' && !Number.isNaN(num) && String(num) === draftValue.trim()
				? num
				: draftValue;
		return { op: op as 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte', columnId, value };
	}

	function resetDraft() {
		editingId = null;
		draftName = '';
		draftTarget = 'row';
		draftOp = 'eq';
		draftValue = '';
		draftMin = '0';
		draftMax = '100';
		draftBg = '#fef3c7';
		draftFg = '#92400e';
		draftColumnId = columns[0]?.id ?? '';
	}

	function loadRule(rule: ConditionalFormatRule) {
		editingId = rule.id;
		draftName = rule.name ?? '';
		draftTarget = rule.target;
		draftBg = rule.style.background ?? '#fef3c7';
		draftFg = rule.style.color ?? '#92400e';
		const w = rule.when;
		draftColumnId = w.columnId;
		draftOp = w.op;
		draftValue = '';
		draftMin = '0';
		draftMax = '100';
		if (w.op === 'between') {
			draftMin = String(w.min);
			draftMax = String(w.max);
		} else if (w.op !== 'empty' && w.op !== 'notEmpty' && 'value' in w) {
			draftValue = String(w.value);
		}
	}

	function saveRule() {
		const when = buildWhen();
		if (!when) return;
		const target = draftTarget as FormatTarget;
		const style = { background: draftBg, color: draftFg };

		if (editingId) {
			emit(
				rules.map((r) =>
					r.id === editingId
						? {
								...r,
								name: draftName || undefined,
								target,
								columnId: target === 'cell' ? when.columnId : undefined,
								when,
								style: { ...r.style, ...style }
							}
						: r
				)
			);
			resetDraft();
			return;
		}

		const maxPriority = rules.reduce((m, r) => Math.max(m, r.priority), 0);
		const rule: ConditionalFormatRule = {
			id: `rule-${Math.random().toString(36).slice(2, 9)}`,
			name: draftName || undefined,
			enabled: true,
			target,
			columnId: target === 'cell' ? when.columnId : undefined,
			when,
			style,
			priority: maxPriority + 1
		};
		emit([...rules, rule]);
		resetDraft();
	}

	function setEnabled(id: string, enabled: boolean) {
		emit(rules.map((r) => (r.id === id ? { ...r, enabled } : r)));
	}

	function remove(id: string) {
		if (editingId === id) resetDraft();
		emit(rules.filter((r) => r.id !== id));
	}

	function move(id: string, dir: -1 | 1) {
		const idx = rules.findIndex((r) => r.id === id);
		if (idx < 0) return;
		const next = [...rules];
		const swap = idx + dir;
		if (swap < 0 || swap >= next.length) return;
		[next[idx], next[swap]] = [next[swap], next[idx]];
		emit(next.map((r, i) => ({ ...r, priority: i + 1 })));
	}

	function describe(rule: ConditionalFormatRule): string {
		const w = rule.when;
		const col = columns.find((c) => c.id === w.columnId)?.label ?? w.columnId;
		if (w.op === 'empty') return `${col} is empty`;
		if (w.op === 'notEmpty') return `${col} is not empty`;
		if (w.op === 'between') return `${col} between ${w.min}–${w.max}`;
		if ('value' in w) return `${col} ${w.op} ${String(w.value)}`;
		return `${col} ${w.op}`;
	}
</script>

<Card variant="elevated" padding="md" class={className}>
	{#snippet header()}
		<div class="flex items-start justify-between gap-3">
			<div class="min-w-0 space-y-0.5">
				<p class="text-sm font-semibold text-primary">Conditional formatting</p>
				<Text size="xs" tone="muted">Paint rows or cells when a condition matches.</Text>
			</div>
			<Badge variant="secondary">{rules.length}</Badge>
		</div>
	{/snippet}

	<div class="space-y-3">
		{#if rules.length === 0}
			<EmptyState
				title="No rules yet"
				description="Add a rule below to highlight matching rows or cells."
				class="!py-6"
			>
				{#snippet icon()}
					<Palette class="h-6 w-6" strokeWidth={1.75} />
				{/snippet}
			</EmptyState>
		{:else}
			<ul class="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
				{#each rules as rule (rule.id)}
					<li
						class={[
							'flex items-center gap-3 px-3 py-2.5 transition-opacity',
							!rule.enabled && 'opacity-55',
							editingId === rule.id && 'bg-brand-500/5'
						]}
					>
						<span
							class="h-10 w-1.5 shrink-0 rounded-full"
							style={`background:${rule.style.background ?? '#94a3b8'}`}
							aria-hidden="true"
						></span>

						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<span class="truncate text-sm font-medium text-primary">
									{rule.name ?? describe(rule)}
								</span>
								<Badge size="sm" variant={rule.target === 'row' ? 'info' : 'primary'}>
									{rule.target === 'row' ? 'Row' : 'Cell'}
								</Badge>
							</div>
							<div class="mt-1 flex flex-wrap items-center gap-2">
								<span
									class="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium"
									style={`background-color:${rule.style.background ?? 'transparent'};color:${rule.style.color ?? 'inherit'};font-weight:${rule.style.fontWeight ?? 'medium'}`}
								>
									Aa preview
								</span>
								<Text as="span" size="xs" tone="muted">{describe(rule)}</Text>
							</div>
						</div>

						<div class="flex shrink-0 items-center gap-1">
							<Toggle
								size="sm"
								checked={rule.enabled}
								label=""
								onchange={(checked) => setEnabled(rule.id, checked)}
							/>
							<IconButton
								size="xs"
								variant="ghost"
								label="Edit rule"
								onclick={() => loadRule(rule)}
							>
								<Pencil class="h-3.5 w-3.5" strokeWidth={2} />
							</IconButton>
							<IconButton
								size="xs"
								variant="ghost"
								label="Move up"
								disabled={rules[0]?.id === rule.id}
								onclick={() => move(rule.id, -1)}
							>
								<ArrowUp class="h-3.5 w-3.5" strokeWidth={2} />
							</IconButton>
							<IconButton
								size="xs"
								variant="ghost"
								label="Move down"
								disabled={rules.at(-1)?.id === rule.id}
								onclick={() => move(rule.id, 1)}
							>
								<ArrowDown class="h-3.5 w-3.5" strokeWidth={2} />
							</IconButton>
							<IconButton
								size="xs"
								variant="ghost"
								label="Delete rule"
								onclick={() => remove(rule.id)}
							>
								<Trash2 class="h-3.5 w-3.5" strokeWidth={2} />
							</IconButton>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	{#snippet footer()}
		<div class="space-y-4">
			<Divider label={isEditing ? 'Edit rule' : 'New rule'} />

			<div class="grid gap-3 sm:grid-cols-2">
				<Input
					label="Name"
					placeholder="Optional"
					size="sm"
					bind:value={draftName}
				/>
				<Select
					label="Target"
					size="sm"
					options={targetOptions}
					bind:value={draftTarget}
				/>
				<Select
					label="Column"
					size="sm"
					options={columnOptions}
					bind:value={draftColumnId}
					placeholder="Select column"
				/>
				<Select
					label="Operator"
					size="sm"
					options={ops}
					bind:value={draftOp}
				/>
				{#if draftOp === 'between'}
					<Input label="Min" size="sm" type="number" bind:value={draftMin} />
					<Input label="Max" size="sm" type="number" bind:value={draftMax} />
				{:else if draftOp !== 'empty' && draftOp !== 'notEmpty'}
					<div class="sm:col-span-2">
						<Input
							label="Value"
							size="sm"
							placeholder="Compare value"
							bind:value={draftValue}
						/>
					</div>
				{/if}
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				<ColorPicker
					label="Background"
					bind:value={draftBg}
					swatches={formatSwatches}
					format="hex"
				/>
				<ColorPicker
					label="Text"
					bind:value={draftFg}
					swatches={formatSwatches}
					format="hex"
				/>
			</div>

			<div class="flex items-center justify-between gap-3">
				<div class="flex items-center gap-2">
					<ColorSwatch color={draftBg} size="sm" label="Background preview" />
					<ColorSwatch color={draftFg} size="sm" label="Text preview" />
					<span
						class="rounded-md px-2 py-1 text-xs font-medium"
						style={`background-color:${draftBg};color:${draftFg}`}
					>
						Preview
					</span>
				</div>
				<div class="flex items-center gap-2">
					{#if isEditing}
						<Button size="sm" variant="ghost" onclick={resetDraft}>Cancel</Button>
					{/if}
					<Button size="sm" variant="primary" onclick={saveRule}>
						{isEditing ? 'Update rule' : 'Add rule'}
					</Button>
				</div>
			</div>
		</div>
	{/snippet}
</Card>
