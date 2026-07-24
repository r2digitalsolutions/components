import type { Meta, StoryObj } from '@storybook/svelte';
import ResizableStory from './ResizableStory.svelte';

const meta = {
	title: 'Molecules/Resizable',
	component: ResizableStory,
	tags: ['autodocs'],
	argTypes: {
		orientation: { control: 'select', options: ['horizontal', 'vertical'] },
		defaultSize: { control: { type: 'range', min: 20, max: 80 } },
		minSize: { control: 'number' },
		maxSize: { control: 'number' }
	},
	args: {
		orientation: 'horizontal',
		defaultSize: 50,
		minSize: 20,
		maxSize: 80
	}
} satisfies Meta<typeof ResizableStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Vertical: Story = {
	args: { orientation: 'vertical', defaultSize: 40 }
};

export const Asymmetric: Story = {
	args: { defaultSize: 30, minSize: 15, maxSize: 70 }
};
