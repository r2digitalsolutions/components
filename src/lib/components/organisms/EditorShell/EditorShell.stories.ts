import type { Meta, StoryObj } from '@storybook/svelte';
import EditorShellStory from './EditorShellStory.svelte';

const meta = {
	title: 'Organisms/EditorShell',
	component: EditorShellStory,
	tags: ['autodocs']
} satisfies Meta<typeof EditorShellStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
