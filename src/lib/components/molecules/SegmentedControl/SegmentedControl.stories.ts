import type { Meta, StoryObj } from '@storybook/svelte';
import SegmentedControlStory from './SegmentedControlStory.svelte';

const meta = {
	title: 'Molecules/SegmentedControl',
	component: SegmentedControlStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		fullWidth: { control: 'boolean' }
	},
	args: { size: 'md', fullWidth: false }
} satisfies Meta<typeof SegmentedControlStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FullWidth: Story = { args: { fullWidth: true } };
