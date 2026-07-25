import type { Meta, StoryObj } from '@storybook/svelte';
import MarketingTemplateStory from './MarketingTemplateStory.svelte';

const meta = {
	title: 'Templates/MarketingTemplate',
	component: MarketingTemplateStory,
	tags: ['autodocs']
} satisfies Meta<typeof MarketingTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
