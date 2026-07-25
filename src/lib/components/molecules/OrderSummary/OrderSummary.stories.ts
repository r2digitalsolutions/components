import type { Meta, StoryObj } from '@storybook/svelte';
import OrderSummaryStory from './OrderSummaryStory.svelte';

const meta = {
	title: 'Molecules/OrderSummary',
	component: OrderSummaryStory,
	tags: ['autodocs']
} satisfies Meta<typeof OrderSummaryStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
