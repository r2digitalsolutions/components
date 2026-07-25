import type { Meta, StoryObj } from '@storybook/svelte';
import PollStory from './PollStory.svelte';

const meta = {
	title: 'Molecules/Poll',
	component: PollStory,
	tags: ['autodocs']
} satisfies Meta<typeof PollStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
