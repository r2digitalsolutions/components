import type { Meta, StoryObj } from '@storybook/svelte';
import ToolbarStory from './ToolbarStory.svelte';

const meta = {
	title: 'Molecules/Toolbar',
	component: ToolbarStory,
	tags: ['autodocs']
} satisfies Meta<typeof ToolbarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
