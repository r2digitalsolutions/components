<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';

	export type BulkEditFieldType = 'text' | 'number' | 'select' | 'boolean';

	export interface BulkEditField {
		id: string;
		label: string;
		type: BulkEditFieldType;
		options?: { value: string; label: string }[];
	}

	interface BulkEditPanelProps {
		fields?: BulkEditField[];
		selectedCount?: number;
		values?: Record<string, unknown>;
		enabled?: Record<string, boolean>;
		applyLabel?: string;
		class?: string;
		onchange?: (values: Record<string, unknown>) => void;
		onapply?: (values: Record<string, unknown>) => void;
	}

	let {
		fields = [],
		selectedCount = 0,
		values = $bindable<Record<string, unknown>>({}),
		enabled = $bindable<Record<string, boolean>>({}),
		applyLabel = 'Apply to selection',
		class: className = '',
		onchange,
		onapply
	}: BulkEditPanelProps = $props();

	function setEnabled(id: string, on: boolean) {
		enabled = { ...enabled, [id]: on };
	}

	function setValue(id: string, v: unknown) {
		values = { ...values, [id]: v };
		onchange?.(activeValues());
	}

	function activeValues(): Record<string, unknown> {
		const out: Record<string, unknown> = {};
		for (const f of fields) {
			if (enabled[f.id]) out[f.id] = values[f.id];
		}
		return out;
	}

	function apply() {
		onapply?.(activeValues());
	}
</script>

<div
	class={['flex flex-col gap-3 rounded-xl border border-border bg-surface-elevated p-4', className]}
	data-bulk-edit-panel
>
	<div class="flex items-center justify-between gap-2">
		<div>
			<p class="text-sm font-semibold text-primary">Bulk edit</p>
			<p class="text-xs text-muted">
				{selectedCount} selected · enable fields to overwrite
			</p>
		</div>
		<Button size="sm" disabled={!selectedCount || !Object.values(enabled).some(Boolean)} onclick={apply}>
			{applyLabel}
		</Button>
	</div>

	<ul class="flex flex-col gap-2">
		{#each fields as field (field.id)}
			<li class="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-2">
				<label class="flex min-w-[8rem] items-center gap-2 text-sm text-primary">
					<input
						type="checkbox"
						checked={!!enabled[field.id]}
						onchange={(e) => setEnabled(field.id, (e.currentTarget as HTMLInputElement).checked)}
					/>
					{field.label}
				</label>
				<div class="min-w-[12rem] flex-1" class:opacity-40={!enabled[field.id]}>
					{#if field.type === 'boolean'}
						<Toggle
							checked={!!values[field.id]}
							disabled={!enabled[field.id]}
							onchange={(v) => setValue(field.id, v)}
						/>
					{:else if field.type === 'select'}
						<Select
							value={String(values[field.id] ?? '')}
							options={field.options ?? []}
							disabled={!enabled[field.id]}
							onchange={(v) => setValue(field.id, v)}
							size="sm"
						/>
					{:else}
						<Input
							type={field.type === 'number' ? 'number' : 'text'}
							value={String(values[field.id] ?? '')}
							disabled={!enabled[field.id]}
							oninput={(e) => {
								const raw = (e.currentTarget as HTMLInputElement).value;
								setValue(field.id, field.type === 'number' ? Number(raw) : raw);
							}}
						/>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</div>
