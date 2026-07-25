import type { Meta, StoryObj } from '@storybook/svelte';
import SkeletonCardStory from './SkeletonCardStory.svelte';

const meta = {
	title: 'Molecules/SkeletonCard',
	component: SkeletonCardStory,
	tags: ['autodocs'],
	argTypes: {
		media: { control: 'boolean' },
		lines: { control: 'number' }
	},
	args: { media: true, lines: 3 }
} satisfies Meta<typeof SkeletonCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
