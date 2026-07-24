import type { Meta, StoryObj } from '@storybook/svelte';
import SkeletonStory from './SkeletonStory.svelte';

const meta = {
	title: 'Atoms/Skeleton',
	component: SkeletonStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['text', 'circular', 'rectangular', 'rounded'] },
		width: { control: 'text' },
		height: { control: 'text' },
		animation: { control: 'select', options: ['pulse', 'shimmer', 'none'] }
	},
	args: {
		variant: 'rounded',
		animation: 'pulse'
	}
} satisfies Meta<typeof SkeletonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RoundedCard: Story = { args: { variant: 'rounded', height: '120px' } };
export const CircularAvatar: Story = { args: { variant: 'circular', animation: 'pulse' } };
export const ShimmerAnimation: Story = { args: { variant: 'rounded', animation: 'shimmer', height: '140px' } };
