import type { Meta, StoryObj } from '@storybook/svelte';
import ScrollAreaStory from './ScrollAreaStory.svelte';

const meta = {
	title: 'Atoms/ScrollArea',
	component: ScrollAreaStory,
	tags: ['autodocs'],
	argTypes: {
		maxHeight: { control: 'number' },
		orientation: { control: 'select', options: ['vertical', 'horizontal', 'both'] },
		hideScrollbar: { control: 'boolean' }
	},
	args: {
		maxHeight: 200,
		orientation: 'vertical',
		hideScrollbar: false
	}
} satisfies Meta<typeof ScrollAreaStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hidden: Story = {
	args: { hideScrollbar: true }
};
