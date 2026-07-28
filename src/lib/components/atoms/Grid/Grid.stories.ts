import type { Meta, StoryObj } from '@storybook/svelte';
import GridStory from './GridStory.svelte';

const meta = {
	title: 'Atoms/Grid',
	component: GridStory,
	tags: ['autodocs'],
	argTypes: {
		cols: { control: 'select', options: [1, 2, 3, 4] }
	},
	args: { cols: 3 }
} satisfies Meta<typeof GridStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwoColumns: Story = { args: { cols: 2 } };
export const Responsive: Story = {
	args: { cols: { base: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 } }
};
