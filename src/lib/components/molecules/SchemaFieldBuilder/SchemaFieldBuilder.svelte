<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import type { FieldType, ResourceField } from '$lib/components/organisms/ResourceStudio/types.js';

	export type { ResourceField, FieldType };

	const FIELD_TYPES: { value: FieldType; label: string }[] = [
		{ value: 'string', label: 'String' },
		{ value: 'text', label: 'Text' },
		{ value: 'number', label: 'Number' },
		{ value: 'boolean', label: 'Boolean' },
		{ value: 'date', label: 'Date' },
		{ value: 'datetime', label: 'DateTime' },
		{ value: 'enum', label: 'Enum' },
		{ value: 'json', label: 'JSON' },
		{ value: 'relation', label: 'Relation' },
		{ value: 'file', label: 'File' },
		{ value: 'custom', label: 'Custom' }
	];

	interface SchemaFieldBuilderProps {
		fields?: ResourceField[];
		class?: string;
		onchange?: (fields: ResourceField[]) => void;
	}

	let {
		fields = $bindable<ResourceField[]>([]),
		class: className = '',
		onchange
	}: SchemaFieldBuilderProps = $props();

	function emit(next: ResourceField[]) {
		fields = next;
		onchange?.(next);
	}

	function addField() {
		const id = `field_${fields.length + 1}`;
		emit([
			...fields,
			{ id, label: `Field ${fields.length + 1}`, type: 'string', required: false }
		]);
	}

	function update(id: string, patch: Partial<ResourceField>) {
		emit(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)));
	}

	function remove(id: string) {
		emit(fields.filter((f) => f.id !== id));
	}

	function move(id: string, dir: -1 | 1) {
		const idx = fields.findIndex((f) => f.id === id);
		const nextIdx = idx + dir;
		if (idx < 0 || nextIdx < 0 || nextIdx >= fields.length) return;
		const next = [...fields];
		const [item] = next.splice(idx, 1);
		next.splice(nextIdx, 0, item);
		emit(next);
	}

	function setOptions(id: string, raw: string) {
		const options = raw
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean)
			.map((line) => {
				const [value, label] = line.split('|');
				return { value: value.trim(), label: (label ?? value).trim() };
			});
		update(id, { options });
	}
</script>

<div
	class={['flex flex-col gap-3 rounded-xl border border-border bg-surface-elevated p-4', className]}
	data-schema-field-builder
>
	<div class="flex items-center justify-between gap-2">
		<div>
			<p class="text-sm font-semibold text-primary">Schema fields</p>
			<p class="text-xs text-muted">{fields.length} fields</p>
		</div>
		<Button size="sm" onclick={addField}>Add field</Button>
	</div>

	{#if !fields.length}
		<p class="rounded-lg border border-dashed border-border px-3 py-8 text-center text-sm text-muted">
			No fields yet.
		</p>
	{:else}
		<ul class="flex flex-col gap-2">
			{#each fields as field, i (field.id)}
				<li class="rounded-xl border border-border p-3">
					<div class="mb-2 flex items-center justify-between gap-2">
						<span class="font-mono text-[11px] text-muted">{field.id}</span>
						<div class="flex gap-1">
							<Button size="sm" variant="ghost" disabled={i === 0} onclick={() => move(field.id, -1)}>
								↑
							</Button>
							<Button
								size="sm"
								variant="ghost"
								disabled={i === fields.length - 1}
								onclick={() => move(field.id, 1)}
							>
								↓
							</Button>
							<Button size="sm" variant="ghost" onclick={() => remove(field.id)}>Remove</Button>
						</div>
					</div>
					<div class="grid gap-2 sm:grid-cols-2">
						<Input
							value={field.id}
							placeholder="id"
							oninput={(e) => update(field.id, { id: (e.currentTarget as HTMLInputElement).value })}
						/>
						<Input
							value={field.label}
							placeholder="Label"
							oninput={(e) => update(field.id, { label: (e.currentTarget as HTMLInputElement).value })}
						/>
						<Select
							value={field.type}
							options={FIELD_TYPES}
							onchange={(v) => update(field.id, { type: v as FieldType })}
						/>
						<label class="flex items-center gap-2 text-sm text-secondary">
							<input
								type="checkbox"
								checked={!!field.required}
								onchange={(e) =>
									update(field.id, { required: (e.currentTarget as HTMLInputElement).checked })}
							/>
							Required
						</label>
						{#if field.type === 'enum'}
							<textarea
								class="col-span-full min-h-[72px] w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-primary"
								placeholder={'value|Label (one per line)'}
								value={(field.options ?? []).map((o) => `${o.value}|${o.label}`).join('\n')}
								oninput={(e) => setOptions(field.id, (e.currentTarget as HTMLTextAreaElement).value)}
							></textarea>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
