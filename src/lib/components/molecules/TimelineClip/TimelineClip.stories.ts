import type { Meta, StoryObj } from '@storybook/svelte';
import TimelineClipStory from './TimelineClipStory.svelte';

const meta = {
	title: 'Molecules/TimelineClip',
	component: TimelineClipStory,
	tags: ['autodocs']
} satisfies Meta<typeof TimelineClipStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
