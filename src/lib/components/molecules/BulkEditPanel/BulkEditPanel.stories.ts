import type { Meta, StoryObj } from '@storybook/svelte';
import BulkEditPanelStory from './BulkEditPanelStory.svelte';

const meta = {
	title: 'Molecules/BulkEditPanel',
	component: BulkEditPanelStory,
	tags: ['autodocs']
} satisfies Meta<typeof BulkEditPanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
