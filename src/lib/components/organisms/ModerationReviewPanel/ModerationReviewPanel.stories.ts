import type { Meta, StoryObj } from '@storybook/svelte';
import ModerationReviewPanelStory from './ModerationReviewPanelStory.svelte';

const meta = {
	title: 'Organisms/ModerationReviewPanel',
	component: ModerationReviewPanelStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof ModerationReviewPanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
