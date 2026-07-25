import type { Meta, StoryObj } from '@storybook/svelte';
import PaymentFormStory from './PaymentFormStory.svelte';

const meta = {
	title: 'Organisms/PaymentForm',
	component: PaymentFormStory,
	tags: ['autodocs']
} satisfies Meta<typeof PaymentFormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
