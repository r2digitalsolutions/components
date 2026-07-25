import type { Meta, StoryObj } from '@storybook/svelte';
import TimeAgoStory from './TimeAgoStory.svelte';

const meta = {
	title: 'Molecules/TimeAgo',
	component: TimeAgoStory,
	tags: ['autodocs']
} satisfies Meta<typeof TimeAgoStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
