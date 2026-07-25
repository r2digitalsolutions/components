import type { Meta, StoryObj } from '@storybook/svelte';
import ContributionGraphStory from './ContributionGraphStory.svelte';

const meta = {
	title: 'Molecules/ContributionGraph',
	component: ContributionGraphStory,
	tags: ['autodocs'],
	argTypes: {
		palette: { control: 'select', options: ['green', 'brand', 'blue', 'orange'] },
		weeks: { control: { type: 'range', min: 12, max: 53, step: 1 } }
	},
	args: { palette: 'green', weeks: 53 }
} satisfies Meta<typeof ContributionGraphStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Brand: Story = {
	args: { palette: 'brand', weeks: 26 }
};
