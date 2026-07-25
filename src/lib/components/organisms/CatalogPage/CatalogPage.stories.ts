import type { Meta, StoryObj } from '@storybook/svelte';
import CatalogPageStory from './CatalogPageStory.svelte';

const meta = {
	title: 'Organisms/CatalogPage',
	component: CatalogPageStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof CatalogPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
