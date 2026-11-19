import type { Meta, StoryObj } from '@storybook/svelte';
import WorkspaceShellStory from './WorkspaceShellStory.svelte';

const meta = {
	title: 'Organisms/WorkspaceShell',
	component: WorkspaceShellStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof WorkspaceShellStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
