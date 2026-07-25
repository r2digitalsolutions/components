/**
 * Lightweight GFM-ish markdown → HTML (no deps).
 * Escapes HTML by default; safe for untrusted source.
 */

export function escapeHtml(s: string) {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/** Stable heading id for TOC / in-page anchors */
export function slugifyHeading(text: string) {
	return text
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/[*_~]+/g, '')
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '') || 'section';
}

function sanitizeUrl(url: string) {
	const trimmed = url.trim().replace(/^<|>$/g, '');
	if (/^(https?:|mailto:|tel:|#|\/)/i.test(trimmed)) return trimmed;
	return '#';
}

/**
 * Split a markdown table row on `|`, ignoring pipes inside `inline code`
 * and treating `\|` as a literal pipe.
 */
export function splitTableRow(row: string): string[] {
	const cells: string[] = [];
	let cur = '';
	let inCode = false;
	let raw = row.trim();
	if (raw.startsWith('|')) raw = raw.slice(1);
	if (raw.endsWith('|')) raw = raw.slice(0, -1);

	for (let i = 0; i < raw.length; i++) {
		const ch = raw[i];
		if (ch === '`') {
			inCode = !inCode;
			cur += ch;
			continue;
		}
		if (!inCode && ch === '\\' && raw[i + 1] === '|') {
			cur += '|';
			i += 1;
			continue;
		}
		if (ch === '|' && !inCode) {
			cells.push(cur.trim());
			cur = '';
			continue;
		}
		cur += ch;
	}
	cells.push(cur.trim());
	return cells;
}

/** Inline markdown → HTML. */
export function renderInline(text: string) {
	const tokens: string[] = [];
	const protect = (html: string) => {
		const id = tokens.length;
		tokens.push(html);
		return `\uE000${id}\uE001`;
	};

	let s = text;

	// Images — match on raw text BEFORE escaping quotes in titles
	s = s.replace(
		/!\[([^\]]*)\]\(\s*<?([^\s)>]+)>?(?:\s+(?:"([^"]*)"|'([^']*)'))?\s*\)/g,
		(_, alt, url, titleDouble, titleSingle) => {
			const title = titleDouble ?? titleSingle;
			const t = title ? ` title="${escapeHtml(title)}"` : '';
			return protect(
				`<img class="md-img" src="${escapeHtml(sanitizeUrl(url))}" alt="${escapeHtml(alt)}"${t} loading="lazy" />`
			);
		}
	);

	// Links
	s = s.replace(
		/\[([^\]]+)\]\(\s*<?([^\s)>]+)>?(?:\s+(?:"([^"]*)"|'([^']*)'))?\s*\)/g,
		(_, label, url, titleDouble, titleSingle) => {
			const title = titleDouble ?? titleSingle;
			const t = title ? ` title="${escapeHtml(title)}"` : '';
			return protect(
				`<a class="md-a" href="${escapeHtml(sanitizeUrl(url))}" rel="noopener noreferrer" target="_blank"${t}>${escapeHtml(label)}</a>`
			);
		}
	);

	// Inline code (protect before escaping)
	s = s.replace(/`([^`]+)`/g, (_, code) =>
		protect(`<code class="md-code">${escapeHtml(code)}</code>`)
	);

	// Escape the remaining plain text (placeholders use private-use chars)
	s = escapeHtml(s);

	// Autolink bare URLs in escaped text
	s = s.replace(/(^|[\s(])(https?:\/\/[^\s<&]+)/g, (_, pre, url) => {
		const clean = url.replace(/[.,;:!?)]+$/, '');
		const trail = url.slice(clean.length);
		return `${pre}${protect(
			`<a class="md-a" href="${escapeHtml(sanitizeUrl(clean))}" rel="noopener noreferrer" target="_blank">${escapeHtml(clean)}</a>`
		)}${trail}`;
	});

	// Bold + italic
	s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
	s = s.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');
	s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
	s = s.replace(/(^|[^*\w])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
	s = s.replace(/(^|[^_\w])_([^_]+)_(?!_)/g, '$1<em>$2</em>');
	s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');

	// Restore protected HTML
	s = s.replace(/\uE000(\d+)\uE001/g, (_, id) => tokens[Number(id)] ?? '');

	return s;
}

export type MarkdownRenderOptions = {
	prefix?: string;
};

/**
 * Convert markdown source to HTML string.
 */
export function renderMarkdown(source: string, _options: MarkdownRenderOptions = {}): string {
	const lines = source.replace(/\r\n/g, '\n').split('\n');
	const out: string[] = [];
	let i = 0;
	const usedIds = new Map<string, number>();

	const uniqueId = (raw: string) => {
		const base = slugifyHeading(raw);
		const count = usedIds.get(base) ?? 0;
		usedIds.set(base, count + 1);
		return count === 0 ? base : `${base}-${count + 1}`;
	};

	let inCode = false;
	let codeLang = '';
	let codeBuf: string[] = [];

	type ListKind = 'ul' | 'ol' | 'task';
	let listKind: ListKind | null = null;

	const closeList = () => {
		if (listKind === 'ul' || listKind === 'task') out.push('</ul>');
		if (listKind === 'ol') out.push('</ol>');
		listKind = null;
	};

	const openList = (kind: ListKind) => {
		if (listKind === kind) return;
		closeList();
		listKind = kind;
		if (kind === 'ol') out.push('<ol class="md-ol">');
		else if (kind === 'task') out.push('<ul class="md-task">');
		else out.push('<ul class="md-ul">');
	};

	const isSepRow = (line: string) =>
		/^\s*\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?\s*$/.test(line) ||
		/^\s*\|?[\s:|-]+\|[\s:|-]+\|?\s*$/.test(line);

	while (i < lines.length) {
		const line = lines[i];

		// Fenced code
		const fence = line.match(/^```([\w-]*)\s*$/);
		if (fence) {
			if (inCode) {
				const lang = codeLang ? ` data-lang="${escapeHtml(codeLang)}"` : '';
				const label = codeLang
					? `<div class="md-pre-label">${escapeHtml(codeLang)}</div>`
					: '';
				out.push(
					`<div class="md-pre-wrap">${label}<pre class="md-pre"${lang}><code>${escapeHtml(codeBuf.join('\n'))}</code></pre></div>`
				);
				codeBuf = [];
				codeLang = '';
				inCode = false;
			} else {
				closeList();
				inCode = true;
				codeLang = fence[1] ?? '';
			}
			i += 1;
			continue;
		}
		if (inCode) {
			codeBuf.push(line);
			i += 1;
			continue;
		}

		// Horizontal rule
		if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)) {
			closeList();
			out.push('<hr class="md-hr" />');
			i += 1;
			continue;
		}

		// Table
		if (line.includes('|') && i + 1 < lines.length && isSepRow(lines[i + 1])) {
			closeList();
			const headers = splitTableRow(line);
			const aligns = splitTableRow(lines[i + 1]).map((cell) => {
				const left = cell.startsWith(':');
				const right = cell.endsWith(':');
				if (left && right) return 'center';
				if (right) return 'right';
				return 'left';
			});
			i += 2;

			const rows: string[][] = [];
			while (i < lines.length && lines[i].includes('|') && lines[i].trim() && !isSepRow(lines[i])) {
				rows.push(splitTableRow(lines[i]));
				i += 1;
			}

			const th = headers
				.map(
					(h, idx) =>
						`<th class="md-th" style="text-align:${aligns[idx] ?? 'left'}">${renderInline(h)}</th>`
				)
				.join('');
			const body = rows
				.map((row) => {
					const tds = headers
						.map(
							(_, idx) =>
								`<td class="md-td" style="text-align:${aligns[idx] ?? 'left'}">${renderInline(row[idx] ?? '')}</td>`
						)
						.join('');
					return `<tr>${tds}</tr>`;
				})
				.join('');
			out.push(
				`<div class="md-table-wrap"><table class="md-table"><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>`
			);
			continue;
		}

		// Headings
		const heading = line.match(/^(#{1,6})\s+(.+)$/);
		if (heading) {
			closeList();
			const level = heading[1].length;
			const raw = heading[2];
			const id = uniqueId(raw);
			out.push(
				`<h${level} id="${escapeHtml(id)}" class="md-h md-h${level} scroll-mt-4">${renderInline(raw)}</h${level}>`
			);
			i += 1;
			continue;
		}

		// Blockquote
		if (/^>\s?/.test(line)) {
			closeList();
			const quote: string[] = [];
			while (i < lines.length && /^>\s?/.test(lines[i])) {
				quote.push(lines[i].replace(/^>\s?/, ''));
				i += 1;
			}
			out.push(
				`<blockquote class="md-quote">${quote.map((q) => `<p>${renderInline(q)}</p>`).join('')}</blockquote>`
			);
			continue;
		}

		// Task list
		const task = line.match(/^[-*]\s+\[([ xX])\]\s+(.+)$/);
		if (task) {
			openList('task');
			const checked = task[1].toLowerCase() === 'x';
			out.push(
				`<li class="md-task-item"><span class="md-check" aria-hidden="true">${checked ? '☑' : '☐'}</span><span>${renderInline(task[2])}</span></li>`
			);
			i += 1;
			continue;
		}

		// Unordered list
		const ul = line.match(/^[-*+]\s+(.+)$/);
		if (ul) {
			openList('ul');
			out.push(`<li>${renderInline(ul[1])}</li>`);
			i += 1;
			continue;
		}

		// Ordered list
		const ol = line.match(/^\d+[.)]\s+(.+)$/);
		if (ol) {
			openList('ol');
			out.push(`<li>${renderInline(ol[1])}</li>`);
			i += 1;
			continue;
		}

		// Blank line
		if (!line.trim()) {
			closeList();
			i += 1;
			continue;
		}

		// Paragraph
		closeList();
		const para: string[] = [line];
		i += 1;
		while (i < lines.length) {
			const next = lines[i];
			if (!next.trim()) break;
			if (/^(#{1,6}\s|```|>\s?|[-*+]\s|\d+[.)]\s|(\*{3,}|-{3,}|_{3,})\s*$)/.test(next)) break;
			if (next.includes('|') && i + 1 < lines.length && isSepRow(lines[i + 1])) break;
			para.push(next);
			i += 1;
		}
		out.push(`<p class="md-p">${para.map((p) => renderInline(p)).join('<br />')}</p>`);
	}

	closeList();
	if (inCode) {
		out.push(
			`<div class="md-pre-wrap"><pre class="md-pre"><code>${escapeHtml(codeBuf.join('\n'))}</code></pre></div>`
		);
	}

	return out.join('\n');
}
