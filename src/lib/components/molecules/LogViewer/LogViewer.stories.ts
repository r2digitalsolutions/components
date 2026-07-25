import type { Meta, StoryObj } from '@storybook/svelte';
import LogViewerStory from './LogViewerStory.svelte';

const meta = {
	title: 'Molecules/LogViewer',
	component: LogViewerStory,
	tags: ['autodocs']
} satisfies Meta<typeof LogViewerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
