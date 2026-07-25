import type { Meta, StoryObj } from '@storybook/svelte';
import CheckboxGroupStory from './CheckboxGroupStory.svelte';

const meta = {
	title: 'Molecules/CheckboxGroup',
	component: CheckboxGroupStory,
	tags: ['autodocs'],
	argTypes: {
		orientation: { control: 'select', options: ['vertical', 'horizontal'] },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	},
	args: { orientation: 'vertical', size: 'md' }
} satisfies Meta<typeof CheckboxGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Horizontal: Story = { args: { orientation: 'horizontal' } };
