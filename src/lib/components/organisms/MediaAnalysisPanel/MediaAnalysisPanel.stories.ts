import type { Meta, StoryObj } from '@storybook/svelte';
import MediaAnalysisPanelStory from './MediaAnalysisPanelStory.svelte';

const meta = {
	title: 'Organisms/MediaAnalysisPanel',
	component: MediaAnalysisPanelStory,
	tags: ['autodocs'],
	argTypes: {
		status: {
			control: 'select',
			options: ['idle', 'queued', 'processing', 'complete', 'failed']
		}
	},
	args: { status: 'complete' }
} satisfies Meta<typeof MediaAnalysisPanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complete: Story = {};
export const Processing: Story = { args: { status: 'processing' } };
export const Failed: Story = { args: { status: 'failed' } };
