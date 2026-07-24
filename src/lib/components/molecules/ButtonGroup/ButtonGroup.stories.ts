import type { Meta, StoryObj } from '@storybook/svelte';
import ButtonGroupStory from './ButtonGroupStory.svelte';

const meta = {
	title: 'Molecules/ButtonGroup',
	component: ButtonGroupStory,
	tags: ['autodocs'],
	argTypes: {
		attached: { control: 'boolean' },
		orientation: { control: 'select', options: ['horizontal', 'vertical'] },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	},
	args: {
		attached: true,
		orientation: 'horizontal',
		size: 'md'
	}
} satisfies Meta<typeof ButtonGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Detached: Story = { args: { attached: false } };
export const Vertical: Story = { args: { orientation: 'vertical' } };
