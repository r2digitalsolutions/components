import type { Meta, StoryObj } from '@storybook/svelte';
import SplitHandleStory from './SplitHandleStory.svelte';

const meta = {
	title: 'Atoms/SplitHandle',
	component: SplitHandleStory,
	tags: ['autodocs'],
	argTypes: {
		example: { control: 'select', options: ['playground', 'both'] },
		orientation: { control: 'select', options: ['horizontal', 'vertical'] },
		dragging: { control: 'boolean' }
	},
	args: { example: 'playground', orientation: 'horizontal', dragging: false }
} satisfies Meta<typeof SplitHandleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'playground', orientation: 'horizontal' }
};

export const Vertical: Story = {
	args: { example: 'playground', orientation: 'vertical' }
};

export const BothOrientations: Story = {
	name: 'Both orientations',
	args: { example: 'both' }
};
