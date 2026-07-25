import type { Meta, StoryObj } from '@storybook/svelte';
import SessionsPageStory from './SessionsPageStory.svelte';

const meta = {
	title: 'Organisms/SessionsPage',
	component: SessionsPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof SessionsPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
