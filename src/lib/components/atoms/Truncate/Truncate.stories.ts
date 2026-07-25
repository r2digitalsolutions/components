import type { Meta, StoryObj } from '@storybook/svelte';
import TruncateStory from './TruncateStory.svelte';

const meta = {
	title: 'Atoms/Truncate',
	component: TruncateStory,
	tags: ['autodocs'],
	argTypes: {
		lines: { control: 'select', options: [1, 2, 3, 4] }
	},
	args: { lines: 1 }
} satisfies Meta<typeof TruncateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwoLines: Story = { args: { lines: 2 } };
export const ThreeLines: Story = { args: { lines: 3 } };
