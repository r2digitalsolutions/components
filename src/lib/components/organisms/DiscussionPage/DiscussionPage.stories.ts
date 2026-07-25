import type { Meta, StoryObj } from '@storybook/svelte';
import DiscussionPageStory from './DiscussionPageStory.svelte';

const meta = {
	title: 'Organisms/DiscussionPage',
	component: DiscussionPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof DiscussionPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
