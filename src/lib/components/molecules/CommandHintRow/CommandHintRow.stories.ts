import type { Meta, StoryObj } from '@storybook/svelte';
import CommandHintRowStory from './CommandHintRowStory.svelte';

const meta = {
	title: 'Molecules/CommandHintRow',
	component: CommandHintRowStory,
	tags: ['autodocs']
} satisfies Meta<typeof CommandHintRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
