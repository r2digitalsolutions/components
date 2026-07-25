import type { Preview } from '@storybook/sveltekit';
import * as svelte from 'svelte';
import { buildUsageCode } from './usage';
import '../src/app.css';

// Guard setContext against Svelte 5 set_context_after_init error when Storybook decorators re-run on prop change
const originalSetContext = svelte.setContext;
try {
	(svelte as unknown as Record<string, unknown>).setContext = (key: unknown, context: unknown) => {
		try {
			return originalSetContext(key, context);
		} catch (err: unknown) {
			const error = err as { code?: string; message?: string };
			if (error?.code === 'set_context_after_init' || error?.message?.includes('set_context_after_init')) {
				return context;
			}
			throw err;
		}
	};
} catch {
	// Fallback if setContext property is read-only
}

function inferComponentName(title: string, storyId?: string): string | null {
	const fromTitle = title.split('/').pop()?.trim();
	if (fromTitle && !fromTitle.endsWith('Story')) return fromTitle;

	const fromId = storyId?.split('--')[0]?.split('-').pop();
	return fromId ?? null;
}

type DocsSourceConfig = {
	code?: string;
	transformArgs?: boolean;
	componentName?: string;
	omit?: string[];
	extraProps?: string[];
};

const preview: Preview = {
	globalTypes: {
		theme: {
			name: 'Theme',
			description: 'Global theme for components',
			defaultValue: 'light',
			toolbar: {
				icon: 'circlehollow',
				items: [
					{ value: 'light', title: 'Light', icon: 'sun' },
					{ value: 'dark', title: 'Dark', icon: 'moon' }
				],
				showName: true
			}
		}
	},
	decorators: [
		(storyFn, context) => {
			const theme = context.globals.theme || 'light';
			if (typeof document !== 'undefined') {
				document.documentElement.classList.toggle('dark', theme === 'dark');
			}
			return storyFn();
		}
	],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		layout: 'centered',
		docs: {
			source: {
				/**
				 * Builds copy-pasteable usage from the public package API + live story args.
				 * - Each story section (Default, Card, …) uses its own `args`
				 * - Changing Controls updates Show code
				 * - Optional static `parameters.docs.source.code` still wins when set without transformArgs
				 */
				transform: (
					src: string,
					ctx: {
						title?: string;
						id?: string;
						args?: Record<string, unknown>;
						parameters?: { docs?: { source?: DocsSourceConfig } };
					}
				) => {
					const sourceCfg = ctx.parameters?.docs?.source;
					const name =
						sourceCfg?.componentName ?? inferComponentName(ctx.title ?? '', ctx.id);

					// Explicit static source always wins unless the story opts into live args
					if (sourceCfg?.code && sourceCfg.transformArgs !== true) {
						return sourceCfg.code;
					}

					const looksLikeStoryWrapper =
						/Story\b/.test(src) || /<[A-Z][A-Za-z0-9]*Story\b/.test(src);

					const shouldBuildFromArgs =
						sourceCfg?.transformArgs === true || looksLikeStoryWrapper || !src?.trim();

					if (name && shouldBuildFromArgs) {
						return buildUsageCode(name, ctx.args ?? {}, {
							omit: sourceCfg?.omit,
							extraProps: sourceCfg?.extraProps
						});
					}

					return src;
				}
			}
		}
	},
	tags: ['autodocs']
};

export default preview;
