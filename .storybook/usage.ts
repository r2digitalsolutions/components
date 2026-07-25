/**
 * Storybook docs helpers — show real library usage in "Show code",
 * including the props from each story's args / Controls.
 */

const STORY_ONLY_ARGS = new Set([
	'label', // sometimes demo-only text for ButtonStory etc. — keep when it's a real prop
]);

/** Props that exist only on *Story wrappers, not on the public component. */
const WRAPPER_ONLY_ARGS = new Set([
	'content',
	'footerText',
	'example'
]);

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
			// document events as stubs
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

/** Prefer this: Show code follows story args / Controls. */
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
				/** Marker so preview transform builds from live args */
				transformArgs: true as const,
				componentName,
				omit: options?.omit,
				extraProps: options?.extraProps
			}
		}
	};
}
