<script lang="ts">
	import Wizard from '$lib/components/organisms/Wizard/Wizard.svelte';
	import DropZone from '$lib/components/molecules/DropZone/DropZone.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import type { StepItem } from '$lib/components/molecules/Stepper/Stepper.svelte';

	export interface ImportColumn {
		id: string;
		label: string;
	}

	export interface ImportMapping {
		source: string;
		target: string;
	}

	export interface ImportResult {
		rows: Record<string, string>[];
		headers: string[];
		mapping: ImportMapping[];
	}

	interface ImportWizardProps {
		columns?: ImportColumn[];
		class?: string;
		onimport?: (result: ImportResult) => void;
		oncancel?: () => void;
	}

	let {
		columns = [],
		class: className = '',
		onimport,
		oncancel
	}: ImportWizardProps = $props();

	const steps: StepItem[] = [
		{ id: 'upload', label: 'Upload', description: 'CSV or TSV file' },
		{ id: 'map', label: 'Map columns', description: 'Match fields' },
		{ id: 'confirm', label: 'Confirm', description: 'Review & import' }
	];

	let current = $state(0);
	let files = $state<File[]>([]);
	let headers = $state<string[]>([]);
	let rows = $state<Record<string, string>[]>([]);
	let mapping = $state<ImportMapping[]>([]);
	let parseError = $state('');

	function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
		const lines = text
			.replace(/^\uFEFF/, '')
			.split(/\r?\n/)
			.filter((l) => l.trim().length);
		if (!lines.length) return { headers: [], rows: [] };
		const delim = lines[0].includes('\t') ? '\t' : ',';
		const split = (line: string) =>
			line.split(delim).map((c) => c.replace(/^"|"$/g, '').trim());
		const hdrs = split(lines[0]);
		const parsed = lines.slice(1).map((line) => {
			const cells = split(line);
			const row: Record<string, string> = {};
			hdrs.forEach((h, i) => {
				row[h] = cells[i] ?? '';
			});
			return row;
		});
		return { headers: hdrs, rows: parsed };
	}

	async function loadFile(list: File[]) {
		files = list;
		parseError = '';
		const file = list[0];
		if (!file) {
			headers = [];
			rows = [];
			mapping = [];
			return;
		}
		try {
			const text = await file.text();
			const parsed = parseCsv(text);
			headers = parsed.headers;
			rows = parsed.rows;
			mapping = headers.map((h) => {
				const match = columns.find(
					(c) => c.id === h || c.label.toLowerCase() === h.toLowerCase()
				);
				return { source: h, target: match?.id ?? '' };
			});
		} catch {
			parseError = 'Could not parse file';
			headers = [];
			rows = [];
		}
	}

	function setTarget(source: string, target: string) {
		mapping = mapping.map((m) => (m.source === source ? { ...m, target } : m));
	}

	function mappedPreview(): Record<string, string>[] {
		return rows.slice(0, 5).map((row) => {
			const out: Record<string, string> = {};
			for (const m of mapping) {
				if (!m.target) continue;
				out[m.target] = row[m.source] ?? '';
			}
			return out;
		});
	}

	function finish() {
		onimport?.({ rows, headers, mapping: mapping.filter((m) => m.target) });
	}

	const canNext = $derived(
		current === 0 ? headers.length > 0 && !parseError : current === 1 ? mapping.some((m) => m.target) : true
	);

	const targetOptions = $derived([
		{ value: '', label: '— skip —' },
		...columns.map((c) => ({ value: c.id, label: c.label }))
	]);
</script>

<div class={['w-full max-w-2xl', className]} data-import-wizard>
	<Wizard
		{steps}
		bind:current
		{canNext}
		finishLabel="Import"
		eyebrow="Import"
		onfinish={finish}
		onback={() => {
			if (current === 0) oncancel?.();
		}}
	>
		{#snippet children(step)}
			{#if step === 0}
				<div class="flex flex-col gap-3">
					<DropZone
						bind:files
						multiple={false}
						accept=".csv,.tsv,text/csv,text/tab-separated-values"
						label="Drop CSV / TSV here"
						hint="or click to browse"
						onchange={loadFile}
						ondropfiles={loadFile}
					/>
					{#if parseError}
						<p class="text-sm text-red-600">{parseError}</p>
					{:else if headers.length}
						<p class="text-xs text-muted">
							Detected {headers.length} columns · {rows.length} rows
						</p>
					{/if}
				</div>
			{:else if step === 1}
				<div class="flex flex-col gap-2">
					{#each mapping as m (m.source)}
						<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
							<code class="truncate rounded-lg bg-surface-overlay px-2 py-1.5 text-xs">{m.source}</code>
							<span class="text-xs text-muted">→</span>
							<Select
								value={m.target}
								options={targetOptions}
								onchange={(v) => setTarget(m.source, v)}
								size="sm"
							/>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col gap-3">
					<p class="text-sm text-secondary">
						Ready to import <strong>{rows.length}</strong> rows with
						<strong>{mapping.filter((m) => m.target).length}</strong> mapped fields.
					</p>
					<div class="overflow-auto rounded-xl border border-border">
						<table class="min-w-full text-left text-xs">
							<thead class="bg-surface-overlay text-muted">
								<tr>
									{#each mapping.filter((m) => m.target) as m (m.target)}
										<th class="px-2 py-1.5 font-medium">{m.target}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each mappedPreview() as row, i (i)}
									<tr class="border-t border-border">
										{#each mapping.filter((m) => m.target) as m (m.target)}
											<td class="px-2 py-1.5 text-primary">{row[m.target]}</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					{#if oncancel}
						<Button variant="ghost" size="sm" onclick={() => oncancel?.()}>Cancel</Button>
					{/if}
				</div>
			{/if}
		{/snippet}
	</Wizard>
</div>
