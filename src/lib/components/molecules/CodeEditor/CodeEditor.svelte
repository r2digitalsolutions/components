<script lang="ts">
	interface CodeEditorProps {
		value?: string;
		language?: string;
		filename?: string;
		readonly?: boolean;
		showLineNumbers?: boolean;
		minHeight?: number;
		placeholder?: string;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		language = 'ts',
		filename = '',
		readonly = false,
		showLineNumbers = true,
		minHeight = 180,
		placeholder = '',
		class: className = '',
		onchange
	}: CodeEditorProps = $props();

	let textareaEl: HTMLTextAreaElement | undefined = $state();
	let preEl: HTMLPreElement | undefined = $state();

	const lines = $derived(Math.max(1, value.split('\n').length));
	const lineNums = $derived(Array.from({ length: lines }, (_, i) => i + 1));

	function syncScroll() {
		if (textareaEl && preEl) {
			preEl.scrollTop = textareaEl.scrollTop;
			preEl.scrollLeft = textareaEl.scrollLeft;
		}
	}

	function onInput(e: Event) {
		value = (e.currentTarget as HTMLTextAreaElement).value;
		onchange?.(value);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'Tab' || readonly) return;
		e.preventDefault();
		const el = e.currentTarget as HTMLTextAreaElement;
		const start = el.selectionStart;
		const end = el.selectionEnd;
		value = value.slice(0, start) + '\t' + value.slice(end);
		onchange?.(value);
		requestAnimationFrame(() => {
			el.selectionStart = el.selectionEnd = start + 1;
		});
	}
</script>

<div
	class={[
		'flex flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated text-primary shadow-sm',
		className
	]}
>
	{#if filename || language}
		<div
			class="flex shrink-0 items-center justify-between border-b border-border bg-surface-overlay/80 px-3 py-1.5"
		>
			<span class="truncate font-mono text-[11px] text-secondary">{filename || language}</span>
			<span
				class="rounded bg-surface-overlay px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-muted uppercase"
			>
				{language}
			</span>
		</div>
	{/if}

	<div class="relative flex min-h-0 flex-1" style:min-height={`${minHeight}px`}>
		{#if showLineNumbers}
			<div
				class="select-none border-r border-border bg-surface-overlay/60 py-3 pr-2 pl-3 text-right font-mono text-[11px] leading-5 text-muted"
				aria-hidden="true"
			>
				{#each lineNums as n (n)}
					<div>{n}</div>
				{/each}
			</div>
		{/if}

		<div class="relative min-h-0 min-w-0 flex-1">
			<textarea
				bind:this={textareaEl}
				class="absolute inset-0 z-10 h-full w-full resize-none bg-transparent p-3 font-mono text-[12px] leading-5 text-transparent caret-[var(--text-primary)] outline-none selection:bg-brand-500/40"
				{value}
				{readonly}
				{placeholder}
				spellcheck="false"
				autocapitalize="off"
				autocomplete="off"
				aria-label={filename || 'Code editor'}
				oninput={onInput}
				onkeydown={onKeydown}
				onscroll={syncScroll}
			></textarea>
			<pre
				bind:this={preEl}
				class="pointer-events-none absolute inset-0 overflow-auto whitespace-pre p-3 font-mono text-[12px] leading-5 text-primary"
				aria-hidden="true"
			><code>{value || ' '}</code></pre>
		</div>
	</div>
</div>
