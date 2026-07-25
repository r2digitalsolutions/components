import type { Meta, StoryObj } from '@storybook/svelte';
import WebhookCardStory from './WebhookCardStory.svelte';

const meta = {
	title: 'Molecules/WebhookCard',
	component: WebhookCardStory,
	tags: ['autodocs']
} satisfies Meta<typeof WebhookCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
