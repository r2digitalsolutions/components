import type { Meta, StoryObj } from '@storybook/svelte';
import UploadQueueStory from './UploadQueueStory.svelte';

const meta = {
	title: 'Molecules/UploadQueue',
	component: UploadQueueStory,
	tags: ['autodocs']
} satisfies Meta<typeof UploadQueueStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
