import type { Meta, StoryObj } from '@storybook/svelte';
import TextStory from './TextStory.svelte';

const meta = {
	title: 'Atoms/Text',
	component: TextStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
		tone: { control: 'select', options: ['primary', 'secondary', 'muted'] }
	},
	args: { size: 'sm', tone: 'secondary' }
} satisfies Meta<typeof TextStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
