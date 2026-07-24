import type { Meta, StoryObj } from '@storybook/svelte';
import AppShellStory from './AppShellStory.svelte';

const meta = {
	title: 'Organisms/AppShell',
	component: AppShellStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof AppShellStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
