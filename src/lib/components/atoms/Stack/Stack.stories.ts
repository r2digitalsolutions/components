import type { Meta, StoryObj } from '@storybook/svelte';
import StackStory from './StackStory.svelte';

const meta = {
	title: 'Atoms/Stack',
	component: StackStory,
	tags: ['autodocs'],
	argTypes: {
		gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
		direction: { control: 'select', options: ['vertical', 'horizontal'] }
	},
	args: { gap: 'md', direction: 'vertical' }
} satisfies Meta<typeof StackStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Horizontal: Story = { args: { direction: 'horizontal' } };
