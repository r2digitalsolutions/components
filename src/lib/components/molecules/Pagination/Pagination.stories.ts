import type { Meta, StoryObj } from '@storybook/svelte';
import PaginationStory from './PaginationStory.svelte';

const meta = {
	title: 'Molecules/Pagination',
	component: PaginationStory,
	tags: ['autodocs'],
	argTypes: {
		totalPages: { control: 'number' },
		siblingCount: { control: 'number' },
		disabled: { control: 'boolean' }
	},
	args: { totalPages: 12, siblingCount: 1, disabled: false }
} satisfies Meta<typeof PaginationStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ManyPages: Story = { args: { totalPages: 40, siblingCount: 1 } };
export const Disabled: Story = { args: { disabled: true } };
