import type { Meta, StoryObj } from '@storybook/svelte';
import RatingStory from './RatingStory.svelte';

const meta = {
	title: 'Atoms/Rating',
	component: RatingStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		max: { control: 'number' },
		readonly: { control: 'boolean' }
	},
	args: {
		value: 3,
		max: 5,
		size: 'md',
		readonly: false
	}
} satisfies Meta<typeof RatingStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ReadOnly: Story = { args: { readonly: true, value: 4 } };
export const Large: Story = { args: { size: 'lg' } };
