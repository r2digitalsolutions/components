import type { Meta, StoryObj } from '@storybook/svelte';
import MaskedInputStory from './MaskedInputStory.svelte';

const meta = {
	title: 'Molecules/MaskedInput',
	component: MaskedInputStory,
	tags: ['autodocs'],
	argTypes: {
		mask: { control: 'text' },
		label: { control: 'text' },
		disabled: { control: 'boolean' },
		status: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
		helperText: { control: 'text' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	},
	args: {
		mask: '(###) ###-####',
		label: 'Phone Number',
		disabled: false,
		status: 'default',
		size: 'md'
	}
} satisfies Meta<typeof MaskedInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Phone: Story = {};

export const Date: Story = {
	args: { mask: '##/##/####', label: 'Date of Birth', helperText: 'MM/DD/YYYY' }
};

export const CreditCard: Story = {
	args: { mask: '#### #### #### ####', label: 'Card Number' }
};

export const ZipCode: Story = {
	args: { mask: '#####-####', label: 'ZIP Code' }
};
