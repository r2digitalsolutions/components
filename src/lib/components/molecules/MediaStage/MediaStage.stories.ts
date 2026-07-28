import type { Meta, StoryObj } from '@storybook/svelte';
import MediaStageStory from './MediaStageStory.svelte';

const meta = {
	title: 'Molecules/MediaStage',
	component: MediaStageStory,
	tags: ['autodocs']
} satisfies Meta<typeof MediaStageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
