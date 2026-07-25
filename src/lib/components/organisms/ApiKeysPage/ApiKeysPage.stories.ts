import type { Meta, StoryObj } from '@storybook/svelte';
import ApiKeysPageStory from './ApiKeysPageStory.svelte';

const meta = {
	title: 'Organisms/ApiKeysPage',
	component: ApiKeysPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof ApiKeysPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
