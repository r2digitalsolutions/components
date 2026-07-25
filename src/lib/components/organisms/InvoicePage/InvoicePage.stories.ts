import type { Meta, StoryObj } from '@storybook/svelte';
import InvoicePageStory from './InvoicePageStory.svelte';

const meta = {
	title: 'Organisms/InvoicePage',
	component: InvoicePageStory,
	tags: ['autodocs'],
	argTypes: {
		status: {
			control: 'select',
			options: ['draft', 'sent', 'paid', 'overdue', 'void']
		}
	},
	args: { status: 'sent' }
} satisfies Meta<typeof InvoicePageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Paid: Story = {
	args: { status: 'paid' }
};

export const Overdue: Story = {
	args: { status: 'overdue' }
};

export const Draft: Story = {
	args: { status: 'draft' }
};
