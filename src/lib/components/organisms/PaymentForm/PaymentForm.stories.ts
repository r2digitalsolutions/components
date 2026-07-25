import type { Meta, StoryObj } from '@storybook/svelte';
import PaymentFormStory from './PaymentFormStory.svelte';

const meta = {
	title: 'Organisms/PaymentForm',
	component: PaymentFormStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'invoice', 'loading']
		}
	},
	args: { variant: 'default' }
} satisfies Meta<typeof PaymentFormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invoice: Story = {
	args: { variant: 'invoice' }
};

export const Loading: Story = {
	args: { variant: 'loading' }
};
