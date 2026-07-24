import type { Meta, StoryObj } from '@storybook/svelte';
import AppShellStory from './AppShellStory.svelte';

const meta = {
	title: 'Organisms/AppShell',
	component: AppShellStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	},
	argTypes: {
		fullHeight: { control: 'boolean' },
		framed: { control: 'boolean' }
	},
	args: {
		fullHeight: true,
		framed: false
	}
} satisfies Meta<typeof AppShellStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fullscreen: Story = {};

export const FramedPreview: Story = {
	name: 'Framed preview',
	args: { fullHeight: false, framed: true },
	parameters: { layout: 'centered' }
};
