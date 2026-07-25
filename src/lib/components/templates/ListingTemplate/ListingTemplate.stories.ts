import type { Meta, StoryObj } from '@storybook/svelte';
import ListingTemplateStory from './ListingTemplateStory.svelte';

const meta = {
	title: 'Templates/ListingTemplate',
	component: ListingTemplateStory,
	tags: ['autodocs']
} satisfies Meta<typeof ListingTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
