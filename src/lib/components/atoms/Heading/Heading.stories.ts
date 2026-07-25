import type { Meta, StoryObj } from '@storybook/svelte';
import HeadingStory from './HeadingStory.svelte';

const meta = {
	title: 'Atoms/Heading',
	component: HeadingStory,
	tags: ['autodocs'],
	argTypes: {
		level: { control: 'select', options: [1, 2, 3, 4] },
		muted: { control: 'boolean' }
	},
	args: { level: 1, muted: false }
} satisfies Meta<typeof HeadingStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
