import type { Meta, StoryObj } from '@storybook/svelte';
import DesktopShellStory from './DesktopShellStory.svelte';

const meta = {
	title: 'Organisms/DesktopShell',
	component: DesktopShellStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	},
	argTypes: {
		example: {
			control: 'select',
			options: [
				'default',
				'dusk',
				'icons',
				'empty',
				'many',
				'widgets',
				'commands',
				'apps',
				'tall'
			]
		}
	}
} satisfies Meta<typeof DesktopShellStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default' }
};

export const DuskWallpaper: Story = {
	args: { example: 'dusk' }
};

export const IconsOnly: Story = {
	args: { example: 'icons' }
};

export const EmptyWithStart: Story = {
	args: { example: 'empty' }
};

export const ManyWindows: Story = {
	args: { example: 'many' }
};

export const WithWidgets: Story = {
	args: { example: 'widgets' }
};

export const CommandPaletteOpen: Story = {
	args: { example: 'commands' }
};

export const AnalyticsFocus: Story = {
	args: { example: 'apps' }
};

export const TallViewport: Story = {
	args: { example: 'tall' }
};
