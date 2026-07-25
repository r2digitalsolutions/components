import type { Meta, StoryObj } from '@storybook/svelte';
import IntegrationsPageStory from './IntegrationsPageStory.svelte';

const meta = {
	title: 'Organisms/IntegrationsPage',
	component: IntegrationsPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof IntegrationsPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
