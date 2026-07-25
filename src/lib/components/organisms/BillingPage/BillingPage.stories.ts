import type { Meta, StoryObj } from '@storybook/svelte';
import BillingPageStory from './BillingPageStory.svelte';

const meta = {
	title: 'Organisms/BillingPage',
	component: BillingPageStory,
	tags: ['autodocs'],
	argTypes: {
		status: {
			control: 'select',
			options: ['active', 'past_due', 'canceled', 'trialing']
		}
	},
	args: { status: 'active' }
} satisfies Meta<typeof BillingPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PastDue: Story = {
	args: { status: 'past_due' }
};

export const Canceled: Story = {
	args: { status: 'canceled' }
};

export const Trialing: Story = {
	args: { status: 'trialing' }
};

export const NoPaymentMethod: Story = {
	args: { emptyPayment: true }
};

export const NoInvoices: Story = {
	args: { emptyInvoices: true }
};
