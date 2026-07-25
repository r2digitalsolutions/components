import type { Meta, StoryObj } from '@storybook/svelte';
import RoadmapStory from './RoadmapStory.svelte';

const meta = {
	title: 'Organisms/Roadmap',
	component: RoadmapStory,
	tags: ['autodocs']
} satisfies Meta<typeof RoadmapStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
