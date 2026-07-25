import type { Meta, StoryObj } from '@storybook/svelte';
import TimeStory from './TimeStory.svelte';

const meta = {
	title: 'Atoms/Time',
	component: TimeStory,
	tags: ['autodocs'],
	argTypes: {
		format: { control: 'select', options: ['short', 'medium', 'long', 'time', 'datetime'] }
	},
	args: { format: 'medium' }
} satisfies Meta<typeof TimeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
