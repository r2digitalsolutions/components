import type { Meta, StoryObj } from '@storybook/svelte';
import ContextMenuStory from './ContextMenuStory.svelte';

const meta = {
	title: 'Molecules/ContextMenu',
	component: ContextMenuStory,
	tags: ['autodocs']
} satisfies Meta<typeof ContextMenuStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
