import type { Meta, StoryObj } from '@storybook/svelte';
import ConditionalFormatPanelStory from './ConditionalFormatPanelStory.svelte';

const meta = {
	title: 'Molecules/ConditionalFormatPanel',
	component: ConditionalFormatPanelStory,
	tags: ['autodocs']
} satisfies Meta<typeof ConditionalFormatPanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
