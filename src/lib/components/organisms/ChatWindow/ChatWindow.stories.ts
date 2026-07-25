import type { Meta, StoryObj } from '@storybook/svelte';
import ChatWindowStory from './ChatWindowStory.svelte';

const meta = {
	title: 'Organisms/ChatWindow',
	component: ChatWindowStory,
	tags: ['autodocs']
} satisfies Meta<typeof ChatWindowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
