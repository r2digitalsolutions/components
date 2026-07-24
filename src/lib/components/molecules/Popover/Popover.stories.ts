import type { Meta, StoryObj } from '@storybook/svelte';
import PopoverStory from './PopoverStory.svelte';

const meta = {
	title: 'Molecules/Popover',
	component: PopoverStory,
	tags: ['autodocs'],
	argTypes: {
		placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] }
	},
	args: { placement: 'bottom' }
} satisfies Meta<typeof PopoverStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Top: Story = { args: { placement: 'top' } };
