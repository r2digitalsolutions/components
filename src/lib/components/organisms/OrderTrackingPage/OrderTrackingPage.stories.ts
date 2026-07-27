import type { Meta, StoryObj } from '@storybook/svelte';
import OrderTrackingPageStory from './OrderTrackingPageStory.svelte';

const meta = {
	title: 'Organisms/OrderTrackingPage',
	component: OrderTrackingPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof OrderTrackingPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
