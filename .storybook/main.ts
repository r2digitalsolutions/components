import type { StorybookConfig } from '@storybook/sveltekit';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
	framework: {
		name: '@storybook/sveltekit',
		options: {}
	},
	docs: {},
	async viteFinal(config) {
		// GitHub project pages: https://<org>.github.io/components/
		const base = process.env.STORYBOOK_BASE || '/';
		return mergeConfig(config, { base });
	}
};

export default config;
