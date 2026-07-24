import type { Meta, StoryObj } from '@storybook/svelte';
import NumberInputStory from './NumberInputStory.svelte';

const meta = {
	title: 'Molecules/NumberInput',
	component: NumberInputStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		controls: { control: 'select', options: ['none', 'stacked', 'sides'] },
		disabled: { control: 'boolean' }
	},
	args: {
		size: 'md',
		disabled: false,
		min: 0,
		max: 99,
		step: 1,
		controls: 'sides'
	}
} satisfies Meta<typeof NumberInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Stacked: Story = { args: { controls: 'stacked' } };
export const NoControls: Story = { args: { controls: 'none' } };
export const Disabled: Story = { args: { disabled: true } };
