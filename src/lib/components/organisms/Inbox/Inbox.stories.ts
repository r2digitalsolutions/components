import type { Meta, StoryObj } from '@storybook/svelte';
import InboxStory from './InboxStory.svelte';

const meta = {
	title: 'Organisms/Inbox',
	component: InboxStory,
	tags: ['autodocs']
} satisfies Meta<typeof InboxStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
