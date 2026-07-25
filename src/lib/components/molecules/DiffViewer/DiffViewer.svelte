<script lang="ts">
	type DiffMode = 'unified' | 'split';

	interface DiffViewerProps {
		before?: string;
		after?: string;
		mode?: DiffMode;
		class?: string;
	}

	let {
		before = '',
		after = '',
		mode = 'unified',
		class: className = ''
	}: DiffViewerProps = $props();

	type Line = { type: 'same' | 'add' | 'del'; text: string };

	const lines = $derived.by(() => {
		const a = before.split('\n');
		const b = after.split('\n');
		const result: Line[] = [];
		const max = Math.max(a.length, b.length);
		for (let i = 0; i < max; i++) {
			const left = a[i];
			const right = b[i];
			if (left === right) {
				if (left !== undefined) result.push({ type: 'same', text: left });
			} else {
				if (left !== undefined) result.push({ type: 'del', text: left });
				if (right !== undefined) result.push({ type: 'add', text: right });
			}
		}
		return result;
	});

	const tone: Record<Line['type'], string> = {
		same: 'bg-transparent text-secondary',
		add: 'bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-200',
		del: 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200'
	};
</script>

<div class={['overflow-auto rounded-xl border border-border bg-surface-elevated font-mono text-xs', className]}>
	{#if mode === 'split'}
		<div class="grid grid-cols-2 divide-x divide-border">
			<div>
				{#each before.split('\n') as line, i}
					<div class="whitespace-pre-wrap px-3 py-0.5 {lines.find((l, idx) => idx <= i * 2 && l.type === 'del') ? tone.del : tone.same}">
						<span class="mr-2 inline-block w-6 text-muted">{i + 1}</span>{line}
					</div>
				{/each}
			</div>
			<div>
				{#each after.split('\n') as line, i}
					<div class="whitespace-pre-wrap px-3 py-0.5 {tone.same}">
						<span class="mr-2 inline-block w-6 text-muted">{i + 1}</span>{line}
					</div>
				{/each}
			</div>
		</div>
	{:else}
		{#each lines as line, i}
			<div class={['whitespace-pre-wrap px-3 py-0.5', tone[line.type]]}>
				<span class="mr-2 inline-block w-4 text-muted">{line.type === 'add' ? '+' : line.type === 'del' ? '−' : ' '}</span>
				<span class="mr-2 inline-block w-6 text-muted">{i + 1}</span>{line.text}
			</div>
		{/each}
	{/if}
</div>
