import type { Meta, StoryObj } from '@storybook/svelte';
import PromptInputStory from './PromptInputStory.svelte';

const meta = {
	title: 'Molecules/PromptInput',
	component: PromptInputStory,
	tags: ['autodocs']
} satisfies Meta<typeof PromptInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
