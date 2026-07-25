import type { Meta, StoryObj } from '@storybook/svelte';
import WebhooksPageStory from './WebhooksPageStory.svelte';

const meta = {
	title: 'Organisms/WebhooksPage',
	component: WebhooksPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof WebhooksPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
