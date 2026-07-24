import type { Meta, StoryObj } from '@storybook/svelte';
import LabelStory from './LabelStory.svelte';

const meta = {
	title: 'Atoms/Label',
	component: LabelStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		required: { control: 'boolean' },
		optional: { control: 'boolean' }
	},
	args: {
		size: 'md',
		required: true,
		optional: true
	}
} satisfies Meta<typeof LabelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
