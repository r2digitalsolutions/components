import type { Meta, StoryObj } from '@storybook/svelte';
import DataTableStory from './DataTableStory.svelte';

const meta = {
	title: 'Molecules/DataTable',
	component: DataTableStory,
	tags: ['autodocs'],
	argTypes: {
		sortable: { control: 'boolean' },
		striped: { control: 'boolean' },
		hoverable: { control: 'boolean' },
		compact: { control: 'boolean' },
		stickyHeader: { control: 'boolean' }
	},
	args: {
		sortable: true,
		striped: false,
		hoverable: true,
		compact: false,
		stickyHeader: false
	}
} satisfies Meta<typeof DataTableStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Striped: Story = { args: { striped: true } };
export const Compact: Story = { args: { compact: true } };
export const NotSortable: Story = { args: { sortable: false } };
