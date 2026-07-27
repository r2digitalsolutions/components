import type { Meta, StoryObj } from '@storybook/svelte';
import AiAssistPanelStory from './AiAssistPanelStory.svelte';

const meta = {
	title: 'Molecules/AiAssistPanel',
	component: AiAssistPanelStory,
	tags: ['autodocs']
} satisfies Meta<typeof AiAssistPanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
