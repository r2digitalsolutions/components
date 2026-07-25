import type { Meta, StoryObj } from '@storybook/svelte';
import MentionInputStory from './MentionInputStory.svelte';

const meta = {
	title: 'Molecules/MentionInput',
	component: MentionInputStory,
	tags: ['autodocs']
} satisfies Meta<typeof MentionInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
