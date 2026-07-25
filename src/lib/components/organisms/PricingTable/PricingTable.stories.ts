import type { Meta, StoryObj } from '@storybook/svelte';
import PricingTableStory from './PricingTableStory.svelte';

const meta = {
	title: 'Organisms/PricingTable',
	component: PricingTableStory,
	tags: ['autodocs']
} satisfies Meta<typeof PricingTableStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
