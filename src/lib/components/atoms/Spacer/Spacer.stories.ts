import type { Meta, StoryObj } from '@storybook/svelte';
import SpacerStory from './SpacerStory.svelte';

const meta = {
	title: 'Atoms/Spacer',
	component: SpacerStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
		axis: { control: 'select', options: ['y', 'x', 'both'] }
	},
	args: { size: 'md', axis: 'y' }
} satisfies Meta<typeof SpacerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
