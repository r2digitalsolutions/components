import type { Meta, StoryObj } from '@storybook/svelte';
import ColumnVisibilityMenuStory from './ColumnVisibilityMenuStory.svelte';

const meta = {
	title: 'Molecules/ColumnVisibilityMenu',
	component: ColumnVisibilityMenuStory,
	tags: ['autodocs']
} satisfies Meta<typeof ColumnVisibilityMenuStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
