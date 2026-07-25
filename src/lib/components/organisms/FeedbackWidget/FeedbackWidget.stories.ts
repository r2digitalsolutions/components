import type { Meta, StoryObj } from '@storybook/svelte';
import FeedbackWidgetStory from './FeedbackWidgetStory.svelte';

const meta = {
	title: 'Organisms/FeedbackWidget',
	component: FeedbackWidgetStory,
	tags: ['autodocs']
} satisfies Meta<typeof FeedbackWidgetStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
