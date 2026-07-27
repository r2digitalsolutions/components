import type { Meta, StoryObj } from '@storybook/svelte';
import PaymentMethodCardStory from './PaymentMethodCardStory.svelte';

const meta = {
	title: 'Molecules/PaymentMethodCard',
	component: PaymentMethodCardStory,
	tags: ['autodocs']
} satisfies Meta<typeof PaymentMethodCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
