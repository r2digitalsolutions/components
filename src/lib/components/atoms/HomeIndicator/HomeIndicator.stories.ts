import type { Meta, StoryObj } from '@storybook/svelte';
import HomeIndicatorStory from './HomeIndicatorStory.svelte';

const meta = {
	title: 'Atoms/HomeIndicator',
	component: HomeIndicatorStory,
	tags: ['autodocs']
} satisfies Meta<typeof HomeIndicatorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
