/**
 * Storybook docs helpers — "Show code" prefers the full *Story.svelte example
 * so demos are actually copy-pasteable (composition, state, snippets).
 *
 * Opt into a minimal public-API snippet with `parameters.docs.source.transformArgs: true`.
 */

const WRAPPER_ONLY_ARGS = new Set(['content', 'footerText', 'example', 'variant']);

/** Raw sources for every *Story.svelte under the library. */
export const storyRawModules = import.meta.glob('../src/lib/components/**/*Story.svelte', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export function formatPropValue(value: unknown): string {
	if (typeof value === 'string') {
		if (value.includes("'") && !value.includes('"')) return `"${value}"`;
		if (value.includes('\n')) return `{\`${value.replace(/`/g, '\\`')}\`}`;
		return `"${value.replace(/"/g, '\\"')}"`;
	}
	if (typeof value === 'number' || typeof value === 'bigint') return `{${value}}`;
	if (typeof value === 'boolean') return `{${value}}`;
	if (value === null) return `{null}`;
	if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
		try {
			return `{${JSON.stringify(value, null, 2).replace(/\n/g, '\n  ')}}`;
		} catch {
			return `{/* … */}`;
		}
	}
	return `{${String(value)}}`;
}

export function formatProp(name: string, value: unknown): string {
	if (typeof value === 'boolean') {
		return value ? name : `${name}={false}`;
	}
	if (typeof value === 'string' && !value.includes('{') && !value.includes('\n')) {
		return `${name}=${formatPropValue(value)}`;
	}
	return `${name}=${formatPropValue(value)}`;
}

export function argsToPropLines(
	args: Record<string, unknown> = {},
	options?: { omit?: string[] }
): string[] {
	const omit = new Set(options?.omit ?? []);
	const lines: string[] = [];

	for (const [key, value] of Object.entries(args)) {
		if (omit.has(key) || WRAPPER_ONLY_ARGS.has(key)) continue;
		if (typeof value === 'function') continue;
		if (value === undefined) continue;
		if (key.startsWith('on') && key.length > 2) {
			lines.push(`${key}={() => {}}`);
			continue;
		}
		lines.push(formatProp(key, value));
	}

	return lines;
}

export function buildUsageCode(
	componentName: string,
	args: Record<string, unknown> = {},
	options?: {
		omit?: string[];
		extraProps?: string[];
		importName?: string;
	}
): string {
	const name = options?.importName ?? componentName;
	const propLines = [...argsToPropLines(args, { omit: options?.omit }), ...(options?.extraProps ?? [])];

	const propsBlock =
		propLines.length === 0 ? ' />' : `\n${propLines.map((l) => `  ${l}`).join('\n')}\n/>`;

	return `<script>
  import { ${name} } from '@r2digisolutions/components';
</script>

<${name}${propsBlock}`;
}

export function usageSource(code: string) {
	return {
		docs: {
			source: {
				type: 'code' as const,
				language: 'svelte',
				code: code.replace(/^\n+/, '').replace(/\n+$/, '')
			}
		}
	};
}

/** Minimal public-API snippet that follows Controls (atoms / simple props). */
export function usageFromArgs(
	componentName: string,
	options?: {
		omit?: string[];
		extraProps?: string[];
		description?: string;
	}
) {
	return {
		docs: {
			description: options?.description
				? { component: options.description }
				: undefined,
			source: {
				language: 'svelte',
				transformArgs: true as const,
				componentName,
				omit: options?.omit,
				extraProps: options?.extraProps
			}
		}
	};
}

export function inferComponentName(title: string, storyId?: string): string | null {
	const fromTitle = title.split('/').pop()?.trim();
	if (fromTitle && !fromTitle.endsWith('Story')) return fromTitle;

	const fromId = storyId?.split('--')[0]?.split('-').pop();
	return fromId ?? null;
}

/** Resolve the companion *Story.svelte raw source for a docs title. */
export function findStoryRawSource(componentName: string | null, title?: string): string | null {
	const name = componentName ?? title?.split('/').pop()?.trim() ?? null;
	if (!name) return null;

	const storyFile = `${name}Story.svelte`;
	const entries = Object.entries(storyRawModules);

	const exact = entries.find(
		([path]) => path.endsWith(`/${name}/${storyFile}`) || path.endsWith(`/${storyFile}`)
	);
	if (exact) return exact[1];

	const loose = entries.find(([path]) => path.endsWith(storyFile));
	return loose?.[1] ?? null;
}

/**
 * Rewrite a Story.svelte into a copy-paste example:
 * - library components → `@r2digisolutions/components`
 * - keep lucide / svelte / local demo logic
 */
export function rewriteStoryForCopy(source: string): string {
	const componentImports = new Set<string>();
	const typeImports = new Set<string>();
	const otherImports: string[] = [];

	const scriptMatch = source.match(/<script([^>]*)>([\s\S]*?)<\/script>/);
	if (!scriptMatch) return source.trim();

	const scriptAttrs = scriptMatch[1] ?? '';
	const scriptBody = scriptMatch[2] ?? '';
	const rest = source.slice(scriptMatch[0].length).trim();

	const lines = scriptBody.split('\n');
	const kept: string[] = [];

	for (const line of lines) {
		const trimmed = line.trim();

		const typeFromLib =
			trimmed.match(
				/^import\s+type\s+\{\s*([^}]+)\s*\}\s+from\s+['"](?:\$lib\/components\/[^'"]+|\.\/[^'"]+)['"]/
			) ??
			trimmed.match(
				/^import\s+type\s+(\w+)\s+from\s+['"](?:\$lib\/components\/[^'"]+|\.\/[^'"]+)['"]/
			);

		if (typeFromLib) {
			const names = typeFromLib[1]
				.split(',')
				.map((n) => n.trim())
				.filter(Boolean);
			for (const n of names) typeImports.add(n);
			continue;
		}

		const valueFromLib = trimmed.match(
			/^import\s+(\w+)\s+from\s+['"](?:\$lib\/components\/[^'"]+|\.\/[^'"]+\.svelte)['"]/
		);
		if (valueFromLib) {
			componentImports.add(valueFromLib[1]);
			continue;
		}

		const namedFromLib = trimmed.match(
			/^import\s+\{\s*([^}]+)\s*\}\s+from\s+['"](?:\$lib\/components\/[^'"]+|\.\/[^'"]+)['"]/
		);
		if (namedFromLib) {
			for (const part of namedFromLib[1].split(',')) {
				const n = part.trim().split(/\s+as\s+/).pop()?.trim();
				if (n) componentImports.add(n);
			}
			continue;
		}

		if (trimmed.startsWith('import ')) {
			otherImports.push(line);
			continue;
		}

		kept.push(line);
	}

	const pkgValues = [...componentImports].sort();
	const pkgTypes = [...typeImports].sort();

	const header: string[] = [];
	if (pkgValues.length || pkgTypes.length) {
		const parts = [
			...pkgValues,
			...pkgTypes.map((t) => `type ${t}`)
		];
		header.push(`\timport { ${parts.join(', ')} } from '@r2digisolutions/components';`);
	}
	header.push(...otherImports);

	const keptBody = kept.join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
	const importBlock = header.join('\n');
	const nextScript = [importBlock, keptBody ? `\n${keptBody}` : ''].join('');

	return `<script${scriptAttrs}>\n${nextScript}\n</script>\n\n${rest}\n`.replace(/\n{3,}/g, '\n\n');
}

export function buildFullStoryCode(
	componentName: string | null,
	title?: string,
	args?: Record<string, unknown>
): string | null {
	const raw = findStoryRawSource(componentName, title);
	if (!raw) return null;
	let code = rewriteStoryForCopy(raw);

	const exampleKey =
		(typeof args?.example === 'string' && args.example) ||
		(typeof args?.variant === 'string' && args.variant) ||
		null;

	if (exampleKey) {
		code = focusStoryExample(code, exampleKey) ?? code;
	}

	return code;
}

/**
 * When a story switches on `example` / `variant`, keep only the active branch
 * so "Show code" matches what you see on canvas.
 */
export function focusStoryExample(source: string, example: string): string | null {
	const scriptMatch = source.match(/<script([^>]*)>([\s\S]*?)<\/script>/);
	if (!scriptMatch) return null;

	const script = scriptMatch[0];
	const markup = source.slice(scriptMatch[0].length);

	const ifRe =
		/\{#if\s+(example|variant)\s*===\s*['"]([^'"]+)['"]\s*\}([\s\S]*?)\{\/if\}/;
	const blockMatch = markup.match(ifRe);
	if (!blockMatch) return null;

	const fullBlock = blockMatch[0];
	const branches = splitExampleBranches(fullBlock);
	const active = branches.find((b) => b.key === example) ?? branches.find((b) => b.key === '*');
	if (!active) return null;

	const before = markup.slice(0, blockMatch.index);
	const after = markup.slice((blockMatch.index ?? 0) + fullBlock.length);
	const focusedMarkup = `${before}\n${active.body.trim()}\n${after}`;

	// Drop example/variant from the public demo props when possible — keep internals.
	let nextScript = script;
	nextScript = nextScript.replace(
		new RegExp(`\\b${blockMatch[1]}\\s*=\\s*['"][^'"]*['"]\\s*,?\\n?`, 'g'),
		''
	);

	return `${nextScript}\n${focusedMarkup}`.replace(/\n{3,}/g, '\n\n');
}

function splitExampleBranches(
	block: string
): Array<{ key: string; body: string }> {
	// Strip outer {#if …} … {/if}
	const inner = block
		.replace(/^\{#if\s+(?:example|variant)\s*===\s*['"][^'"]+['"]\s*\}/, '')
		.replace(/\{\/if\}$/, '');

	const keys: string[] = [];
	const firstKeyMatch = block.match(
		/^\{#if\s+(?:example|variant)\s*===\s*['"]([^'"]+)['"]\s*\}/
	);
	if (firstKeyMatch) keys.push(firstKeyMatch[1]);

	const re = /\{:else if\s+(?:example|variant)\s*===\s*['"]([^'"]+)['"]\s*\}|\{:else\}/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(block))) {
		keys.push(m[1] ?? '*');
	}

	const chunks = inner.split(/\{:else if\s+(?:example|variant)\s*===\s*['"][^'"]+['"]\s*\}|\{:else\}/);
	return chunks.map((body, i) => ({
		key: keys[i] ?? `branch-${i}`,
		body
	}));
}
