import type { Meta, StoryObj } from '@storybook/svelte';
import SmartSuggestionStory from './SmartSuggestionStory.svelte';

const meta = {
	title: 'Molecules/SmartSuggestion',
	component: SmartSuggestionStory,
	tags: ['autodocs']
} satisfies Meta<typeof SmartSuggestionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
