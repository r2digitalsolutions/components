import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-a11y'
	],
	framework: {
		name: '@storybook/sveltekit',
		options: {}
	},
	docs: {}
};

export default config;
