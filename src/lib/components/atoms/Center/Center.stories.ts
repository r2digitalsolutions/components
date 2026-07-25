import type { Meta, StoryObj } from '@storybook/svelte';
import CenterStory from './CenterStory.svelte';

const meta = {
	title: 'Atoms/Center',
	component: CenterStory,
	tags: ['autodocs'],
	argTypes: {
		axis: { control: 'select', options: ['both', 'x', 'y'] },
		align: { control: 'select', options: ['start', 'center', 'end'] },
		padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
		maxWidth: { control: 'text' }
	},
	args: { axis: 'both', align: 'center', padding: 'md', maxWidth: '' }
} satisfies Meta<typeof CenterStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Horizontal: Story = { args: { axis: 'x' } };
export const Vertical: Story = { args: { axis: 'y', align: 'end' } };
