<script lang="ts">
	interface DropZoneProps {
		label?: string;
		hint?: string;
		accept?: string;
		multiple?: boolean;
		disabled?: boolean;
		maxSizeMb?: number;
		class?: string;
		ondropfiles?: (files: File[]) => void;
	}

	let {
		label = 'Drop files here',
		hint = 'or click to browse',
		accept,
		multiple = true,
		disabled = false,
		maxSizeMb = 25,
		class: className = '',
		ondropfiles
	}: DropZoneProps = $props();

	let dragging = $state(false);
	let error = $state('');
	let inputEl = $state<HTMLInputElement | null>(null);
	let depth = $state(0);

	const maxBytes = $derived(maxSizeMb * 1024 * 1024);

	function pick(list: FileList | File[] | null) {
		if (!list || disabled) return;
		const files = Array.from(list);
		const tooBig = files.find((f) => f.size > maxBytes);
		if (tooBig) {
			error = `"${tooBig.name}" exceeds ${maxSizeMb}MB`;
			return;
		}
		error = '';
		ondropfiles?.(files);
	}

	function onDragEnter(e: DragEvent) {
		e.preventDefault();
		if (disabled) return;
		depth += 1;
		dragging = true;
	}

	function onDragLeave(e: DragEvent) {
		e.preventDefault();
		depth = Math.max(0, depth - 1);
		if (depth === 0) dragging = false;
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		depth = 0;
		dragging = false;
		pick(e.dataTransfer?.files ?? null);
	}
</script>

<div class={['w-full', className]}>
	<button
		type="button"
		class={[
			'flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
			dragging
				? 'border-brand-500 bg-brand-500/5'
				: 'border-border bg-surface-overlay/40 hover:border-border-strong hover:bg-surface-overlay',
			disabled && 'cursor-not-allowed opacity-50'
		]}
		{disabled}
		onclick={() => inputEl?.click()}
		ondragenter={onDragEnter}
		ondragleave={onDragLeave}
		ondragover={onDragOver}
		ondrop={onDrop}
	>
		<svg class="h-8 w-8 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
		</svg>
		<div>
			<p class="text-sm font-medium text-primary">{label}</p>
			<p class="mt-0.5 text-xs text-muted">{hint}</p>
		</div>
		<input
			bind:this={inputEl}
			type="file"
			class="sr-only"
			{accept}
			{multiple}
			{disabled}
			onchange={(e) => pick((e.currentTarget as HTMLInputElement).files)}
		/>
	</button>
	{#if error}
		<p class="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
	{/if}
</div>
