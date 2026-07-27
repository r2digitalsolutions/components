import type { Meta, StoryObj } from '@storybook/svelte';
import VersionHistoryPanelStory from './VersionHistoryPanelStory.svelte';

const meta = {
	title: 'Molecules/VersionHistoryPanel',
	component: VersionHistoryPanelStory,
	tags: ['autodocs']
} satisfies Meta<typeof VersionHistoryPanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
