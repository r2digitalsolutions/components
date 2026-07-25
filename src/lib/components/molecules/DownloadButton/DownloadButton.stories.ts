import type { Meta, StoryObj } from '@storybook/svelte';
import DownloadButtonStory from './DownloadButtonStory.svelte';

const meta = {
	title: 'Molecules/DownloadButton',
	component: DownloadButtonStory,
	tags: ['autodocs']
} satisfies Meta<typeof DownloadButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
