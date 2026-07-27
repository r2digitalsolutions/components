import type { Meta, StoryObj } from '@storybook/svelte';
import ShippingEstimateStory from './ShippingEstimateStory.svelte';

const meta = {
	title: 'Molecules/ShippingEstimate',
	component: ShippingEstimateStory,
	tags: ['autodocs']
} satisfies Meta<typeof ShippingEstimateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
