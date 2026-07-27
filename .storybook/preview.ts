import type { Preview } from '@storybook/sveltekit';
import {
	buildFullStoryCode,
	buildUsageCode,
	inferComponentName,
	prefetchStoryRawSource
} from './usage';
import '../src/app.css';

type DocsSourceConfig = {
	code?: string;
	/** When true, emit a minimal public-API snippet from Controls args. */
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
		/**
		 * Full canvas width by default so stories resize with the Storybook pane.
		 * Use `layout: 'centered'` only for floating UI (modals, toasts, command palette).
		 * Use `layout: 'fullscreen'` for shells / full-bleed layouts.
		 */
		layout: 'padded',
		docs: {
			source: {
				/**
				 * Default: full *Story.svelte example (composition + state), rewritten to
				 * `@r2digisolutions/components` imports — actually useful to copy.
				 *
				 * Opt-in minimal API snippet: `parameters.docs.source.transformArgs: true`
				 * Static override: `parameters.docs.source.code`
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

					if (sourceCfg?.code && sourceCfg.transformArgs !== true) {
						return sourceCfg.code;
					}

					if (sourceCfg?.transformArgs === true && name) {
						return buildUsageCode(name, ctx.args ?? {}, {
							omit: sourceCfg?.omit,
							extraProps: sourceCfg?.extraProps
						});
					}

					// Warm cache async; first paint may fall back to Storybook's own source.
					prefetchStoryRawSource(name, ctx.title);
					const full = buildFullStoryCode(name, ctx.title, ctx.args);
					if (full) return full;

					return src;
				}
			}
		}
	},
	tags: ['autodocs']
};

export default preview;
