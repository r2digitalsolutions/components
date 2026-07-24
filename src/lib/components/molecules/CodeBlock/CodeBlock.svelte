<script lang="ts">
	interface CodeBlockProps {
		code?: string;
		language?: string;
		filename?: string;
		showCopy?: boolean;
		showLineNumbers?: boolean;
		/** `adaptive` follows light/dark; `contrast` is always a dark editor. */
		tone?: 'adaptive' | 'contrast';
		class?: string;
	}

	let {
		code = '',
		language = 'ts',
		filename = '',
		showCopy = true,
		showLineNumbers = true,
		tone = 'adaptive',
		class: className = ''
	}: CodeBlockProps = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const lines = $derived(code.replace(/\n$/, '').split('\n'));

	const keywords = new Set([
		'import',
		'export',
		'from',
		'default',
		'const',
		'let',
		'var',
		'function',
		'return',
		'if',
		'else',
		'for',
		'while',
		'class',
		'extends',
		'implements',
		'interface',
		'type',
		'async',
		'await',
		'new',
		'this',
		'true',
		'false',
		'null',
		'undefined',
		'switch',
		'case',
		'break',
		'continue',
		'try',
		'catch',
		'finally',
		'throw',
		'typeof',
		'instanceof',
		'in',
		'of',
		'as'
	]);

	function escapeHtml(text: string) {
		return text
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;');
	}

	function wrap(cls: string | null, token: string) {
		const safe = escapeHtml(token);
		return cls ? `<span class="${cls}">${safe}</span>` : safe;
	}

	function highlightLine(line: string) {
		if (!line) return '&nbsp;';

		const parts: string[] = [];
		const re =
			/(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*")|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)|([^\w\s'"`]+)|(\s+)|(['"`])/g;

		let match: RegExpExecArray | null;
		while ((match = re.exec(line)) !== null) {
			const [token, comment, block, string, number, word, punct, space, loneQuote] = match;
			if (comment || block) {
				parts.push(wrap('cb-comment', token));
			} else if (string) {
				parts.push(wrap('cb-string', token));
			} else if (number) {
				parts.push(wrap('cb-number', token));
			} else if (word) {
				if (keywords.has(word)) parts.push(wrap('cb-kw', token));
				else if (/^[A-Z]/.test(word)) parts.push(wrap('cb-type', token));
				else parts.push(wrap(null, token));
			} else if (punct || loneQuote) {
				parts.push(wrap('cb-punct', token));
			} else if (space) {
				parts.push(escapeHtml(token));
			} else {
				parts.push(wrap(null, token));
			}
		}

		return parts.join('') || '&nbsp;';
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 1600);
		} catch {
			copied = false;
		}
	}
</script>

<div
	class={[
		'code-block overflow-hidden rounded-xl border text-sm shadow-sm',
		tone === 'contrast' ? 'code-block--contrast' : 'code-block--adaptive',
		className
	]}
>
	<div class="cb-header flex items-center gap-3 border-b px-3 py-2">
		<div class="flex items-center gap-1.5" aria-hidden="true">
			<span class="cb-dot h-2.5 w-2.5 rounded-full"></span>
			<span class="cb-dot h-2.5 w-2.5 rounded-full opacity-80"></span>
			<span class="cb-dot h-2.5 w-2.5 rounded-full opacity-60"></span>
		</div>

		<div class="min-w-0 flex-1 truncate font-mono text-[11px] tracking-wide">
			{#if filename}
				<span class="cb-filename">{filename}</span>
			{:else}
				<span class="cb-lang uppercase">{language}</span>
			{/if}
		</div>

		{#if filename}
			<span class="cb-lang hidden rounded-md px-1.5 py-0.5 font-mono text-[10px] uppercase sm:inline">
				{language}
			</span>
		{/if}

		{#if showCopy}
			<button
				type="button"
				onclick={copy}
				class="cb-copy inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors"
				aria-label={copied ? 'Copied' : 'Copy code'}
			>
				{#if copied}
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
					Copied
				{:else}
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2" />
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
						/>
					</svg>
					Copy
				{/if}
			</button>
		{/if}
	</div>

	<div class="cb-body overflow-x-auto py-2.5 font-mono text-[13px] leading-[1.45]">
		{#each lines as line, i (i)}
			<div class="cb-row flex">
				{#if showLineNumbers}
					<span class="cb-gutter select-none">{i + 1}</span>
				{/if}
				<span class="cb-line grow">{@html highlightLine(line)}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.code-block--adaptive {
		border-color: var(--border);
		background: var(--surface-elevated);
		color: var(--text-primary);
	}

	.code-block--adaptive .cb-header {
		border-color: var(--border);
		background: var(--surface-overlay);
	}

	.code-block--adaptive .cb-dot:nth-child(1) {
		background: #ff5f57;
	}
	.code-block--adaptive .cb-dot:nth-child(2) {
		background: #febc2e;
	}
	.code-block--adaptive .cb-dot:nth-child(3) {
		background: #28c840;
	}

	.code-block--adaptive .cb-filename,
	.code-block--adaptive .cb-lang {
		color: var(--text-muted);
	}

	.code-block--adaptive .cb-copy {
		color: var(--text-secondary);
	}
	.code-block--adaptive .cb-copy:hover {
		background: color-mix(in oklab, var(--text-primary) 6%, transparent);
		color: var(--text-primary);
	}

	.code-block--adaptive .cb-gutter {
		color: var(--text-muted);
		opacity: 0.55;
		min-width: 2.75rem;
		padding-left: 0.75rem;
		padding-right: 1rem;
		text-align: right;
		user-select: none;
	}

	.code-block--adaptive .cb-line {
		padding-right: 1rem;
		white-space: pre;
	}

	.code-block--adaptive .cb-kw {
		color: #7c3aed;
	}
	.code-block--adaptive .cb-string {
		color: #059669;
	}
	.code-block--adaptive .cb-comment {
		color: var(--text-muted);
		font-style: italic;
	}
	.code-block--adaptive .cb-number {
		color: #d97706;
	}
	.code-block--adaptive .cb-type {
		color: #2563eb;
	}
	.code-block--adaptive .cb-punct {
		color: var(--text-secondary);
	}

	:global(.dark) .code-block--adaptive .cb-kw {
		color: #c4b5fd;
	}
	:global(.dark) .code-block--adaptive .cb-string {
		color: #6ee7b7;
	}
	:global(.dark) .code-block--adaptive .cb-number {
		color: #fbbf24;
	}
	:global(.dark) .code-block--adaptive .cb-type {
		color: #93c5fd;
	}

	.code-block--contrast {
		border-color: oklch(30% 0.03 265);
		background: oklch(18% 0.03 265);
		color: oklch(93% 0.01 265);
	}

	.code-block--contrast .cb-header {
		border-color: oklch(30% 0.03 265);
		background: oklch(15% 0.025 265);
	}

	.code-block--contrast .cb-dot:nth-child(1) {
		background: #ff5f57;
	}
	.code-block--contrast .cb-dot:nth-child(2) {
		background: #febc2e;
	}
	.code-block--contrast .cb-dot:nth-child(3) {
		background: #28c840;
	}

	.code-block--contrast .cb-filename,
	.code-block--contrast .cb-lang {
		color: oklch(70% 0.02 265);
	}

	.code-block--contrast .cb-copy {
		color: oklch(75% 0.02 265);
	}
	.code-block--contrast .cb-copy:hover {
		background: oklch(100% 0 0 / 0.08);
		color: white;
	}

	.code-block--contrast .cb-gutter {
		color: oklch(55% 0.02 265);
		min-width: 2.75rem;
		padding-left: 0.75rem;
		padding-right: 1rem;
		text-align: right;
		user-select: none;
	}

	.code-block--contrast .cb-line {
		padding-right: 1rem;
		white-space: pre;
	}

	.code-block--contrast .cb-kw {
		color: #c4b5fd;
	}
	.code-block--contrast .cb-string {
		color: #6ee7b7;
	}
	.code-block--contrast .cb-comment {
		color: oklch(58% 0.02 265);
		font-style: italic;
	}
	.code-block--contrast .cb-number {
		color: #fbbf24;
	}
	.code-block--contrast .cb-type {
		color: #93c5fd;
	}
	.code-block--contrast .cb-punct {
		color: oklch(72% 0.02 265);
	}
</style>
