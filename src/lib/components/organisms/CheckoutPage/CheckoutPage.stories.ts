import type { Meta, StoryObj } from '@storybook/svelte';
import CheckoutPageStory from './CheckoutPageStory.svelte';

const meta = {
	title: 'Organisms/CheckoutPage',
	component: CheckoutPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof CheckoutPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
