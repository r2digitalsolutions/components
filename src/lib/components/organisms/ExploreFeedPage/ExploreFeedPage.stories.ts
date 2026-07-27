import type { Meta, StoryObj } from '@storybook/svelte';
import ExploreFeedPageStory from './ExploreFeedPageStory.svelte';

const meta = {
	title: 'Organisms/ExploreFeedPage',
	component: ExploreFeedPageStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof ExploreFeedPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
