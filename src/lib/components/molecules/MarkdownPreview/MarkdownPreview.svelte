<script lang="ts">
	interface MarkdownPreviewProps {
		source?: string;
		class?: string;
	}

	let { source = '', class: className = '' }: MarkdownPreviewProps = $props();

	function escapeHtml(s: string) {
		return s
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	function renderInline(text: string) {
		let s = escapeHtml(text);
		s = s.replace(/`([^`]+)`/g, '<code class="rounded bg-surface-overlay px-1 py-0.5 text-[0.85em]">$1</code>');
		s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
		s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
		s = s.replace(
			/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
			'<a class="text-brand-600 underline dark:text-brand-400" href="$2" rel="noopener noreferrer" target="_blank">$1</a>'
		);
		return s;
	}

	const html = $derived.by(() => {
		const lines = source.replace(/\r\n/g, '\n').split('\n');
		const out: string[] = [];
		let inCode = false;
		let codeBuf: string[] = [];
		let inList = false;

		const closeList = () => {
			if (inList) {
				out.push('</ul>');
				inList = false;
			}
		};

		for (const line of lines) {
			if (line.startsWith('```')) {
				if (inCode) {
					out.push(
						`<pre class="overflow-x-auto rounded-xl bg-surface-overlay p-3 text-xs"><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`
					);
					codeBuf = [];
					inCode = false;
				} else {
					closeList();
					inCode = true;
				}
				continue;
			}
			if (inCode) {
				codeBuf.push(line);
				continue;
			}

			if (/^###\s+/.test(line)) {
				closeList();
				out.push(`<h3 class="mt-4 text-base font-semibold text-primary">${renderInline(line.replace(/^###\s+/, ''))}</h3>`);
			} else if (/^##\s+/.test(line)) {
				closeList();
				out.push(`<h2 class="mt-4 text-lg font-semibold text-primary">${renderInline(line.replace(/^##\s+/, ''))}</h2>`);
			} else if (/^#\s+/.test(line)) {
				closeList();
				out.push(`<h1 class="mt-4 text-xl font-semibold text-primary">${renderInline(line.replace(/^#\s+/, ''))}</h1>`);
			} else if (/^>\s+/.test(line)) {
				closeList();
				out.push(
					`<blockquote class="border-l-2 border-border pl-3 text-secondary">${renderInline(line.replace(/^>\s+/, ''))}</blockquote>`
				);
			} else if (/^[-*]\s+/.test(line)) {
				if (!inList) {
					out.push('<ul class="list-disc space-y-1 pl-5">');
					inList = true;
				}
				out.push(`<li>${renderInline(line.replace(/^[-*]\s+/, ''))}</li>`);
			} else if (!line.trim()) {
				closeList();
				out.push('<div class="h-2"></div>');
			} else {
				closeList();
				out.push(`<p class="text-sm leading-relaxed text-secondary">${renderInline(line)}</p>`);
			}
		}
		closeList();
		if (inCode) {
			out.push(
				`<pre class="overflow-x-auto rounded-xl bg-surface-overlay p-3 text-xs"><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`
			);
		}
		return out.join('\n');
	});
</script>

<div class={['prose-r2 space-y-2', className]}>{@html html}</div>
