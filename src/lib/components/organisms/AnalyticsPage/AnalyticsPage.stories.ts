import type { Meta, StoryObj } from '@storybook/svelte';
import AnalyticsPageStory from './AnalyticsPageStory.svelte';

const meta = {
	title: 'Organisms/AnalyticsPage',
	component: AnalyticsPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof AnalyticsPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
