import type { Meta, StoryObj } from '@storybook/svelte';
import SegmentedPagerStory from './SegmentedPagerStory.svelte';

const meta = {
	title: 'Molecules/SegmentedPager',
	component: SegmentedPagerStory,
	tags: ['autodocs']
} satisfies Meta<typeof SegmentedPagerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
