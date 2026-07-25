import type { Meta, StoryObj } from '@storybook/svelte';
import CheckoutTemplateStory from './CheckoutTemplateStory.svelte';

const meta = {
	title: 'Templates/CheckoutTemplate',
	component: CheckoutTemplateStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'empty', 'coupon', 'shipping', 'payment', 'success', 'loading']
		},
		framed: { control: 'boolean' }
	}
} satisfies Meta<typeof CheckoutTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default', framed: true }
};

export const Empty: Story = {
	args: { example: 'empty' }
};

export const WithCoupon: Story = {
	args: { example: 'coupon' }
};

export const Shipping: Story = {
	args: { example: 'shipping' }
};

export const Payment: Story = {
	args: { example: 'payment' }
};

export const Success: Story = {
	args: { example: 'success' }
};

export const Loading: Story = {
	args: { example: 'loading' }
};
