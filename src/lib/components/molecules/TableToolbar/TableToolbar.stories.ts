import type { Meta, StoryObj } from '@storybook/svelte';
import TableToolbarStory from './TableToolbarStory.svelte';

const meta = {
	title: 'Molecules/TableToolbar',
	component: TableToolbarStory,
	tags: ['autodocs']
} satisfies Meta<typeof TableToolbarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
