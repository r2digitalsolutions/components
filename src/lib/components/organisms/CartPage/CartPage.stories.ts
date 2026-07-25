import type { Meta, StoryObj } from '@storybook/svelte';
import CartPageStory from './CartPageStory.svelte';

const meta = {
	title: 'Organisms/CartPage',
	component: CartPageStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'empty', 'coupon']
		}
	},
	args: { variant: 'default' }
} satisfies Meta<typeof CartPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCoupon: Story = {
	args: { variant: 'coupon' }
};

export const Empty: Story = {
	args: { variant: 'empty' }
};
