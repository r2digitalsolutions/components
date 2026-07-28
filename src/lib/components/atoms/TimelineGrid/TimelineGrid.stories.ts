import type { Meta, StoryObj } from '@storybook/svelte';
import TimelineGridStory from './TimelineGridStory.svelte';

const meta = {
	title: 'Atoms/TimelineGrid',
	component: TimelineGridStory,
	tags: ['autodocs']
} satisfies Meta<typeof TimelineGridStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
