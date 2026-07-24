import type { Meta, StoryObj } from '@storybook/svelte';
import TooltipStory from './TooltipStory.svelte';

const meta = {
	title: 'Atoms/Tooltip',
	component: TooltipStory,
	tags: ['autodocs'],
	argTypes: {
		content: { control: 'text' },
		side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] }
	},
	args: { content: 'Helpful tip', side: 'top' }
} satisfies Meta<typeof TooltipStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = { args: { side: 'top' } };
export const Bottom: Story = { args: { side: 'bottom' } };
export const Left: Story = { args: { side: 'left' } };
export const Right: Story = { args: { side: 'right' } };
