import type { Preview } from '@storybook/sveltekit';
import * as svelte from 'svelte';
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
		layout: 'centered'
	},
	tags: ['autodocs']
};

export default preview;
